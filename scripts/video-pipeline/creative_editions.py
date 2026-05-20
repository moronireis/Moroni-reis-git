#!/usr/bin/env python3
"""Creative video editions — advanced effects beyond basic captions.

Generates multiple creative variations of a single video using ffmpeg filters:
  - cinematic: color grade + vignette + slow zoom + boxed captions
  - impact: zoom pulses on key words + large bold captions + flash
  - clean_pro: progress bar + gentle zoom + word highlight captions
  - hype: speed ramp (slow hook, fast middle) + bass zoom + big captions

Usage:
    python creative_editions.py \
        --input ~/Downloads/criativos/89C01EA6.MOV \
        --transcript ~/Downloads/criativos/output/transcripts/89C01EA6.json \
        --output-dir ~/Downloads/criativos/editions \
        [--edition cinematic] [--all]
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from lib.ffmpeg_helpers import FFmpegError, run
from lib.reis_ass_template import (
    AssLine,
    AssStyle,
    AssWord,
    build_ass,
    lines_from_whisper_words,
    REIS_BLUE_ASS,
    WHITE_ASS,
    BLACK_ASS,
)

# --- Caption style variants ---

def caption_style_boxed() -> AssStyle:
    """Captions with semi-transparent dark box behind text."""
    return AssStyle(
        font_name="Inter",
        font_size=68,
        primary=WHITE_ASS,
        secondary=REIS_BLUE_ASS,
        outline=BLACK_ASS,
        back="&H80000000",      # semi-transparent black bg
        bold=-1,
        outline_width=0,        # no outline — box does the work
        shadow=0,
        alignment=2,
        margin_v=220,
    )


def caption_style_impact() -> AssStyle:
    """Large bold captions, thick outline, centered. Safe margins to prevent overflow."""
    return AssStyle(
        font_name="Inter",
        font_size=82,
        primary=WHITE_ASS,
        secondary=REIS_BLUE_ASS,
        outline=BLACK_ASS,
        back="&H00000000",
        bold=-1,
        outline_width=5,
        shadow=2,
        alignment=5,            # middle center
        margin_l=100,           # safe left margin
        margin_r=100,           # safe right margin
        margin_v=0,
    )


def caption_style_clean() -> AssStyle:
    """Clean, smaller captions at bottom with word highlight."""
    return AssStyle(
        font_name="Inter",
        font_size=64,
        primary=WHITE_ASS,
        secondary=REIS_BLUE_ASS,
        outline=BLACK_ASS,
        back="&H00000000",
        bold=-1,
        outline_width=3,
        shadow=0,
        alignment=2,
        margin_v=180,
    )


def caption_style_hype() -> AssStyle:
    """Big, energetic captions centered with thick blue outline."""
    return AssStyle(
        font_name="Inter",
        font_size=96,
        primary=WHITE_ASS,
        secondary="&H0000FFFF",   # yellow highlight for hype
        outline="&H00FF904A",     # REIS blue outline
        back="&H00000000",
        bold=-1,
        outline_width=4,
        shadow=3,
        alignment=5,
        margin_v=0,
    )


# Custom ASS builders for special styles

def build_ass_with_box_style(lines: list[AssLine], style: AssStyle) -> str:
    """ASS with BorderStyle=3 (opaque box behind text)."""
    s = style
    header = (
        "[Script Info]\n"
        "Title: REIS [IA] Captions — Boxed\n"
        "ScriptType: v4.00+\n"
        f"PlayResX: {s.play_res_x}\n"
        f"PlayResY: {s.play_res_y}\n"
        "WrapStyle: 2\n"
        "ScaledBorderAndShadow: yes\n"
        "\n"
        "[V4+ Styles]\n"
        "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, "
        "OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, "
        "ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, "
        "Alignment, MarginL, MarginR, MarginV, Encoding\n"
        f"Style: Reis,{s.font_name},{s.font_size},{s.primary},{s.secondary},"
        f"{s.outline},{s.back},{s.bold},0,0,0,100,100,2,0,3,12,"  # BorderStyle=3, Outline=12 (box padding)
        f"{s.shadow},{s.alignment},{s.margin_l},{s.margin_r},{s.margin_v},1\n"
        "\n"
        "[Events]\n"
        "Format: Layer, Start, End, Style, Name, MarginL, MarginR, "
        "MarginV, Effect, Text\n"
    )
    events = []
    for line in lines:
        if not line.words:
            continue
        parts = []
        for w in line.words:
            cs = max(1, int(round((w.end - w.start) * 100)))
            parts.append(f"{{\\k{cs}}}{w.text}")
        text = " ".join(parts)
        h1 = int(line.start // 3600)
        m1 = int((line.start % 3600) // 60)
        s1 = line.start - (h1 * 3600 + m1 * 60)
        h2 = int(line.end // 3600)
        m2 = int((line.end % 3600) // 60)
        s2 = line.end - (h2 * 3600 + m2 * 60)
        events.append(
            f"Dialogue: 0,{h1}:{m1:02d}:{s1:05.2f},{h2}:{m2:02d}:{s2:05.2f},"
            f"Reis,,0,0,0,,{text}"
        )
    return header + "\n".join(events) + "\n"


# --- FFmpeg filter chains per edition ---

EDITIONS = {
    "cinematic": {
        "description": "Color grade + vignette + slow zoom + boxed captions",
        "caption_style": "boxed",
        "filters": [
            # Color grading: boost contrast, slight teal-orange look
            "eq=contrast=1.15:brightness=0.02:saturation=1.1",
            # Teal shadows + warm highlights
            "colorbalance=rs=0.05:gs=-0.03:bs=-0.08:rh=0.08:gh=0.02:bh=-0.04",
            # Vignette
            "vignette=PI/4",
            # Slow zoom in over the full video (1.0 -> 1.08)
            "scale=2*iw:2*ih,"
            "zoompan=z='min(1.08,1+0.0008*on)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=30",
        ],
    },
    "impact": {
        "description": "Zoom pulses + large centered captions + flash on cuts",
        "caption_style": "impact",
        "max_words": 3,         # fewer words per line to prevent screen overflow
        "filters": [
            # Slight contrast boost
            "eq=contrast=1.1:brightness=0.01:saturation=1.05",
            # Zoom pulse effect: subtle periodic zoom (breathe effect)
            "scale=2*iw:2*ih,"
            "zoompan=z='1.02+0.02*sin(2*PI*on/90)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=30",
        ],
    },
    "clean_pro": {
        "description": "Gentle zoom + progress bar + clean word highlight",
        "caption_style": "clean",
        "filters": [
            # Subtle color correction
            "eq=contrast=1.05:brightness=0.01:saturation=1.02",
            # Very gentle slow zoom
            "scale=2*iw:2*ih,"
            "zoompan=z='min(1.04,1+0.0004*on)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=30",
        ],
        "overlay_filters": [
            # Progress bar at top (blue line that grows across the video)
            "drawbox=x=0:y=0:w='t/duration*iw':h=6:color=#4A90FF@0.9:t=fill",
        ],
    },
    "hype": {
        "description": "Speed ramp + bass zoom + big centered captions",
        "caption_style": "hype",
        "filters": [
            # Boost contrast + saturation for energy
            "eq=contrast=1.2:brightness=0.02:saturation=1.15",
            # Stronger zoom pulse (bass hit feel)
            "scale=2*iw:2*ih,"
            "zoompan=z='1.03+0.03*sin(2*PI*on/60)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=30",
            # Slight sharpening
            "unsharp=5:5:0.8",
        ],
    },
}


def load_words(transcript_path: Path) -> list[dict]:
    data = json.loads(transcript_path.read_text(encoding="utf-8"))
    return data.get("words", [])


def get_duration(transcript_path: Path) -> float:
    data = json.loads(transcript_path.read_text(encoding="utf-8"))
    return data.get("duration", 60.0)


def build_edition(
    ffmpeg: str,
    video: Path,
    transcript_path: Path,
    output_dir: Path,
    edition_name: str,
    max_words: int = 4,
) -> Path | None:
    edition = EDITIONS[edition_name]
    words = load_words(transcript_path)
    duration = get_duration(transcript_path)

    if not words:
        print(f"  [!] No words in transcript", file=sys.stderr)
        return None

    print(f"\n  [{edition_name}] {edition['description']}", file=sys.stderr)

    # Build caption lines — use per-edition max_words if defined
    effective_max_words = edition.get("max_words", max_words)
    lines = lines_from_whisper_words(words, max_words_per_line=effective_max_words, max_line_duration=2.0)

    # Build ASS with the right style
    style_name = edition["caption_style"]
    if style_name == "boxed":
        style = caption_style_boxed()
        ass_text = build_ass_with_box_style(lines, style)
    elif style_name == "impact":
        style = caption_style_impact()
        ass_text = build_ass(lines, style=style)
    elif style_name == "clean":
        style = caption_style_clean()
        ass_text = build_ass(lines, style=style)
    elif style_name == "hype":
        style = caption_style_hype()
        ass_text = build_ass(lines, style=style)
    else:
        style = AssStyle()
        ass_text = build_ass(lines, style=style)

    # Write ASS
    ass_dir = output_dir / "ass"
    ass_dir.mkdir(parents=True, exist_ok=True)
    ass_path = ass_dir / f"{video.stem}_{edition_name}.ass"
    ass_path.write_text(ass_text, encoding="utf-8")
    print(f"  [{edition_name}] {len(lines)} caption lines -> {ass_path.name}", file=sys.stderr)

    # Build filter chain
    # Step 1: Apply video effects
    vf_parts = list(edition["filters"])

    # Step 2: Burn captions
    vf_parts.append(f"ass={ass_path}")

    # Step 3: Add overlay filters (like progress bar)
    for ovf in edition.get("overlay_filters", []):
        # Replace 'duration' placeholder with actual duration
        vf_parts.append(ovf.replace("duration", str(duration)))

    # Step 4: Final format
    vf_parts.append("format=yuv420p")

    vf = ",".join(vf_parts)

    # Output
    final_dir = output_dir / "final"
    final_dir.mkdir(parents=True, exist_ok=True)
    out_path = final_dir / f"{video.stem}_{edition_name}.mp4"

    cmd = [
        ffmpeg, "-y",
        "-i", str(video),
        "-vf", vf,
        "-r", "30",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "20",
        "-c:a", "aac",
        "-b:a", "192k",
        "-movflags", "+faststart",
        str(out_path),
    ]

    try:
        run(cmd, timeout=3600)
    except FFmpegError as e:
        print(f"  [{edition_name}] ERROR: {e}", file=sys.stderr)
        return None

    size_mb = out_path.stat().st_size / (1024 * 1024)
    print(f"  [{edition_name}] OK -> {out_path.name} ({size_mb:.1f}MB)", file=sys.stderr)
    return out_path


def find_ffmpeg() -> str:
    import os
    import shutil
    from_env = os.environ.get("FFMPEG_PATH")
    if from_env and os.path.isfile(from_env):
        return from_env
    on_path = shutil.which("ffmpeg")
    if on_path:
        return on_path
    fallbacks = [
        "/Users/moronireis/Library/Python/3.9/bin/ffmpeg",
        "/opt/ffmpeg/bin/ffmpeg",
        "/usr/local/bin/ffmpeg",
    ]
    for p in fallbacks:
        if os.path.isfile(p):
            return p
    raise FileNotFoundError("ffmpeg not found")


VIDEO_EXTS = {".mov", ".mp4", ".mkv", ".avi", ".webm", ".m4v"}


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Creative video editions with effects.")
    group = p.add_mutually_exclusive_group(required=True)
    group.add_argument("--input", type=Path, help="Single source video.")
    group.add_argument("--batch-dir", type=Path, help="Directory of videos to process.")
    p.add_argument("--transcript", type=Path, help="Whisper JSON transcript (single mode).")
    p.add_argument("--transcripts-dir", type=Path, help="Dir with transcripts (batch mode).")
    p.add_argument("--output-dir", type=Path, required=True, help="Output directory.")
    p.add_argument("--edition", choices=list(EDITIONS.keys()), default="impact", help="Edition style.")
    p.add_argument("--all", action="store_true", help="Build all editions (single mode only).")
    p.add_argument("--max-words", type=int, default=4, help="Max words per caption line.")
    return p.parse_args()


def main() -> int:
    args = parse_args()
    ffmpeg = find_ffmpeg()
    print(f"[editions] Using ffmpeg: {ffmpeg}", file=sys.stderr)

    # Batch mode
    if args.batch_dir:
        if not args.batch_dir.is_dir():
            print(f"ERROR: batch-dir not found: {args.batch_dir}", file=sys.stderr)
            return 1
        transcripts_dir = args.transcripts_dir or (args.batch_dir / "output" / "transcripts")
        if not transcripts_dir.is_dir():
            print(f"ERROR: transcripts dir not found: {transcripts_dir}", file=sys.stderr)
            return 1

        videos = sorted([
            f for f in args.batch_dir.iterdir()
            if f.suffix.lower() in VIDEO_EXTS and f.is_file()
        ])
        print(f"[editions] Batch: {len(videos)} videos, edition={args.edition}", file=sys.stderr)

        results = []
        for idx, video in enumerate(videos, 1):
            transcript = transcripts_dir / f"{video.stem}.json"
            if not transcript.exists():
                print(f"\n[{idx}/{len(videos)}] SKIP {video.name} — no transcript", file=sys.stderr)
                continue
            print(f"\n[{idx}/{len(videos)}] {video.name}", file=sys.stderr)
            out = build_edition(
                ffmpeg, video, transcript, args.output_dir, args.edition,
                max_words=args.max_words,
            )
            if out:
                results.append((video.name, out))

        print(f"\n{'='*60}", file=sys.stderr)
        print(f"[editions] COMPLETE — {len(results)}/{len(videos)} processed", file=sys.stderr)
        for name, path in results:
            size = path.stat().st_size / (1024 * 1024)
            print(f"  {name} -> {path.name} ({size:.1f}MB)", file=sys.stderr)
        return 0

    # Single mode
    if not args.input.exists():
        print(f"ERROR: input not found: {args.input}", file=sys.stderr)
        return 1
    if not args.transcript or not args.transcript.exists():
        print(f"ERROR: transcript not found: {args.transcript}", file=sys.stderr)
        return 1

    print(f"[editions] Source: {args.input.name}", file=sys.stderr)
    editions_to_build = list(EDITIONS.keys()) if args.all else [args.edition or "impact"]

    results = []
    for ed in editions_to_build:
        out = build_edition(
            ffmpeg, args.input, args.transcript, args.output_dir, ed,
            max_words=args.max_words,
        )
        if out:
            results.append((ed, out))

    print(f"\n{'='*60}", file=sys.stderr)
    print(f"[editions] {len(results)}/{len(editions_to_build)} editions built:", file=sys.stderr)
    for name, path in results:
        size = path.stat().st_size / (1024 * 1024)
        print(f"  {name}: {path.name} ({size:.1f}MB)", file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main())
