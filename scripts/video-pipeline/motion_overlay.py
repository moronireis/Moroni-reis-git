#!/usr/bin/env python3
"""Motion graphics overlay — animated elements synced to speech.

Creates animated keyword popups, counters, badges, and icons
that appear when specific words/phrases are spoken.

Uses MoviePy for compositing + Pillow for rendering graphic elements.

Usage:
    python motion_overlay.py \
        --input ~/Downloads/criativos/editions_impact/final/89C01EA6_impact.mp4 \
        --transcript ~/Downloads/criativos/output/transcripts/89C01EA6.json \
        --output ~/Downloads/criativos/motion_demo/89C01EA6_motion.mp4
"""
from __future__ import annotations

import argparse
import json
import math
import sys
from pathlib import Path
from typing import List, Tuple

sys.path.insert(0, str(Path(__file__).parent))

from PIL import Image, ImageDraw, ImageFont

# REIS [IA] brand tokens
REIS_BLUE = (74, 144, 255)       # #4A90FF
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
DARK_BG = (10, 10, 15, 200)     # semi-transparent dark
ACCENT_GLOW = (74, 144, 255, 80) # blue glow


def find_font(size: int) -> ImageFont.FreeTypeFont:
    """Find Inter or fallback font."""
    font_paths = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial Bold.ttf",
    ]
    # Try Inter first
    try:
        return ImageFont.truetype("Inter-Bold", size)
    except OSError:
        pass
    for p in font_paths:
        try:
            return ImageFont.truetype(p, size)
        except OSError:
            continue
    return ImageFont.load_default()


def render_keyword_badge(
    text: str,
    width: int = 400,
    height: int = 80,
    font_size: int = 36,
    bg_color: tuple = DARK_BG,
    text_color: tuple = WHITE,
    accent_color: tuple = REIS_BLUE,
) -> Image.Image:
    """Render a keyword badge with rounded corners and accent line."""
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Rounded rectangle background
    radius = 16
    draw.rounded_rectangle(
        [(0, 0), (width - 1, height - 1)],
        radius=radius,
        fill=bg_color,
    )

    # Left accent bar
    draw.rounded_rectangle(
        [(0, 0), (6, height - 1)],
        radius=3,
        fill=(*accent_color, 255),
    )

    # Text
    font = find_font(font_size)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    tx = (width - tw) // 2 + 3  # slight offset for accent bar
    ty = (height - th) // 2 - 2
    draw.text((tx, ty), text, fill=text_color, font=font)

    return img


def render_counter_badge(
    number: str,
    label: str,
    width: int = 300,
    height: int = 120,
) -> Image.Image:
    """Render a big number counter with label below."""
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background
    draw.rounded_rectangle(
        [(0, 0), (width - 1, height - 1)],
        radius=20,
        fill=(10, 10, 20, 210),
    )

    # Border glow
    draw.rounded_rectangle(
        [(0, 0), (width - 1, height - 1)],
        radius=20,
        outline=(*REIS_BLUE, 180),
        width=2,
    )

    # Big number
    num_font = find_font(52)
    bbox = draw.textbbox((0, 0), number, font=num_font)
    nw = bbox[2] - bbox[0]
    draw.text(((width - nw) // 2, 10), number, fill=REIS_BLUE, font=num_font)

    # Label
    label_font = find_font(22)
    bbox = draw.textbbox((0, 0), label, font=label_font)
    lw = bbox[2] - bbox[0]
    draw.text(((width - lw) // 2, 75), label, fill=WHITE, font=label_font)

    return img


def render_cta_badge(
    text: str = "CLICA AQUI",
    width: int = 340,
    height: int = 70,
) -> Image.Image:
    """Render a CTA button badge."""
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Solid blue rounded rectangle
    draw.rounded_rectangle(
        [(0, 0), (width - 1, height - 1)],
        radius=35,
        fill=(*REIS_BLUE, 240),
    )

    # Text
    font = find_font(30)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(
        ((width - tw) // 2, (height - th) // 2 - 2),
        text,
        fill=WHITE,
        font=font,
    )

    # Arrow hint
    arrow_font = find_font(28)
    draw.text((width - 50, (height - 28) // 2 - 2), ">", fill=WHITE, font=arrow_font)

    return img


def render_pill_tag(
    text: str,
    width: int = 220,
    height: int = 50,
) -> Image.Image:
    """Render a small pill tag (like a hashtag or category)."""
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle(
        [(0, 0), (width - 1, height - 1)],
        radius=25,
        fill=(255, 255, 255, 30),
        outline=(*REIS_BLUE, 150),
        width=2,
    )

    font = find_font(24)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(
        ((width - tw) // 2, (height - th) // 2 - 1),
        text,
        fill=WHITE,
        font=font,
    )

    return img


# --- Animation helpers ---

def ease_out_back(t: float) -> float:
    """Overshoot ease-out for pop-in effect."""
    c1 = 1.70158
    c3 = c1 + 1
    return 1 + c3 * pow(t - 1, 3) + c1 * pow(t - 1, 2)


def ease_out_cubic(t: float) -> float:
    return 1 - pow(1 - t, 3)


# --- Overlay element definition ---

class OverlayElement:
    """An animated element to overlay on the video."""

    def __init__(
        self,
        image: Image.Image,
        start: float,
        end: float,
        position: Tuple[int, int],
        anim_in: float = 0.3,
        anim_out: float = 0.2,
        anim_type: str = "pop",  # pop, slide_left, slide_right, fade
    ):
        self.image = image
        self.start = start
        self.end = end
        self.x, self.y = position
        self.anim_in = anim_in
        self.anim_out = anim_out
        self.anim_type = anim_type
        self.w, self.h = image.size

    def get_frame(self, t: float) -> Tuple[Image.Image, int, int, float] | None:
        """Return (image, x, y, opacity) for time t, or None if not visible."""
        if t < self.start or t > self.end:
            return None

        # Calculate animation progress
        elapsed = t - self.start
        remaining = self.end - t
        opacity = 1.0
        offset_x, offset_y = 0, 0
        scale = 1.0

        # Animate in
        if elapsed < self.anim_in and self.anim_in > 0:
            progress = elapsed / self.anim_in
            if self.anim_type == "pop":
                scale = ease_out_back(progress)
                opacity = min(1.0, progress * 2)
            elif self.anim_type == "slide_left":
                offset_x = int(-100 * (1 - ease_out_cubic(progress)))
                opacity = ease_out_cubic(progress)
            elif self.anim_type == "slide_right":
                offset_x = int(100 * (1 - ease_out_cubic(progress)))
                opacity = ease_out_cubic(progress)
            elif self.anim_type == "fade":
                opacity = ease_out_cubic(progress)

        # Animate out
        elif remaining < self.anim_out and self.anim_out > 0:
            progress = remaining / self.anim_out
            opacity = progress
            if self.anim_type == "pop":
                scale = 0.8 + 0.2 * progress

        # Always work on a copy to avoid mutating the original
        img = self.image.copy()

        # Apply scale if needed
        if scale != 1.0 and scale > 0.01:
            new_w = max(1, int(self.w * scale))
            new_h = max(1, int(self.h * scale))
            img = img.resize((new_w, new_h), Image.LANCZOS)
            offset_x += (self.w - new_w) // 2
            offset_y += (self.h - new_h) // 2

        # Apply opacity
        if opacity < 1.0:
            alpha = img.split()[3]
            alpha = alpha.point(lambda p: int(p * max(0.0, min(1.0, opacity))))
            img.putalpha(alpha)

        return (img, self.x + offset_x, self.y + offset_y, opacity)


def define_elements_for_89C01EA6() -> List[OverlayElement]:
    """Define motion elements for the Cloud Code creative."""
    elements = []

    # 0.0-4.3: "Tudo mundo falando de Cloud Code... mais de 40 agentes, 40 funcionários"
    elements.append(OverlayElement(
        render_counter_badge("40+", "AGENTES IA"),
        start=2.5, end=5.5,
        position=(390, 300),
        anim_type="pop",
    ))

    # 4.3-9.5: "time de tráfico, design, criação de site, aplicativo"
    elements.append(OverlayElement(
        render_pill_tag("TRAFEGO"),
        start=5.2, end=7.8,
        position=(80, 380),
        anim_type="slide_left",
    ))
    elements.append(OverlayElement(
        render_pill_tag("DESIGN"),
        start=5.8, end=8.0,
        position=(330, 380),
        anim_type="slide_right",
    ))
    elements.append(OverlayElement(
        render_pill_tag("SITES & APPS", width=260),
        start=6.8, end=9.0,
        position=(580, 380),
        anim_type="slide_right",
    ))

    # 9.5-14.4: "24 horas, 7 dias por semana"
    elements.append(OverlayElement(
        render_counter_badge("24/7", "SEM PARAR"),
        start=11.5, end=14.5,
        position=(390, 300),
        anim_type="pop",
    ))

    # 14.4-18.4: "não vai precisar saber nada técnico"
    elements.append(OverlayElement(
        render_keyword_badge("ZERO CODIGO", width=350, font_size=34),
        start=16.0, end=19.0,
        position=(365, 350),
        anim_type="pop",
    ))

    # 21.8-27.1: "4 aulas pra instalar"
    elements.append(OverlayElement(
        render_counter_badge("4", "AULAS"),
        start=23.0, end=26.5,
        position=(390, 300),
        anim_type="pop",
    ))

    # 27.1-35.7: "por menos 47 reais"
    elements.append(OverlayElement(
        render_counter_badge("R$47", "ACESSO TOTAL", width=320),
        start=33.0, end=36.5,
        position=(380, 300),
        anim_type="pop",
    ))

    # 36.2-44.0: "clica aqui e saiba mais"
    elements.append(OverlayElement(
        render_cta_badge("CLICA AQUI"),
        start=36.5, end=43.0,
        position=(370, 1650),
        anim_type="pop",
        anim_in=0.4,
    ))

    return elements


def composite_frames(
    video_path: Path,
    elements: List[OverlayElement],
    output_path: Path,
    ffmpeg_path: str | None = None,
) -> None:
    """Composite overlay elements onto video frame-by-frame via ffmpeg raw pipe."""
    import subprocess

    ffmpeg = ffmpeg_path or "/Users/moronireis/Library/Python/3.9/bin/ffmpeg"
    ffprobe = "/Users/moronireis/Projetos vscode/scripts/carousel-engine/node_modules/@ffprobe-installer/darwin-arm64/ffprobe"

    # Get video info
    result = subprocess.run(
        [ffprobe, "-v", "quiet", "-print_format", "json", "-show_format", "-show_streams", str(video_path)],
        capture_output=True, text=True,
    )
    info = json.loads(result.stdout)
    vstream = [s for s in info["streams"] if s["codec_type"] == "video"][0]
    fps_parts = vstream.get("r_frame_rate", "30/1").split("/")
    fps = float(fps_parts[0]) / float(fps_parts[1]) if len(fps_parts) == 2 else 30.0
    width = int(vstream["width"])
    height = int(vstream["height"])
    duration = float(info["format"]["duration"])

    total_frames = int(duration * fps)
    frame_size = width * height * 3  # RGB24, not RGBA — simpler and avoids alpha issues
    print(f"  [motion] {width}x{height} @ {fps:.1f}fps, {duration:.1f}s, {total_frames} frames", file=sys.stderr)

    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Decode as RGB24 (3 bytes per pixel)
    decoder = subprocess.Popen(
        [ffmpeg, "-i", str(video_path), "-f", "rawvideo", "-pix_fmt", "rgb24", "-v", "error", "pipe:1"],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE,
    )

    # Encode from RGB24, take audio from original
    encoder = subprocess.Popen(
        [
            ffmpeg, "-y",
            "-f", "rawvideo", "-pix_fmt", "rgb24",
            "-s", f"{width}x{height}", "-r", str(fps),
            "-i", "pipe:0",
            "-i", str(video_path),
            "-map", "0:v", "-map", "1:a",
            "-c:v", "libx264", "-preset", "medium", "-crf", "20",
            "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "192k",
            "-movflags", "+faststart",
            "-shortest",
            str(output_path),
        ],
        stdin=subprocess.PIPE, stderr=subprocess.PIPE,
    )

    frame_idx = 0
    overlaid_count = 0

    try:
        while True:
            raw = decoder.stdout.read(frame_size)
            if len(raw) < frame_size:
                break

            t = frame_idx / fps
            frame_idx += 1

            # Check active elements
            active = [e for e in elements if e.start <= t <= e.end]

            if active:
                # Convert RGB to Pillow, composite RGBA elements, convert back to RGB
                frame = Image.frombytes("RGB", (width, height), raw)
                frame_rgba = frame.convert("RGBA")

                for elem in active:
                    result = elem.get_frame(t)
                    if result:
                        img, x, y, _ = result
                        # Clamp position to avoid out-of-bounds
                        if x < 0 or y < 0 or x + img.width > width or y + img.height > height:
                            continue
                        frame_rgba.paste(img, (x, y), img)

                frame_rgb = frame_rgba.convert("RGB")
                raw = frame_rgb.tobytes()
                overlaid_count += 1

            encoder.stdin.write(raw)

            if frame_idx % 300 == 0:
                pct = frame_idx / total_frames * 100
                print(f"  [motion] {pct:.0f}% ({frame_idx}/{total_frames}) overlaid={overlaid_count}", file=sys.stderr)

    except BrokenPipeError:
        pass
    finally:
        decoder.stdout.close()
        decoder.wait()
        if encoder.stdin and not encoder.stdin.closed:
            encoder.stdin.close()
        encoder.wait()

    if encoder.returncode != 0:
        stderr = encoder.stderr.read().decode()
        print(f"  [motion] encode error: {stderr[:500]}", file=sys.stderr)
        return

    size_mb = output_path.stat().st_size / (1024 * 1024)
    print(f"  [motion] OK -> {output_path.name} ({size_mb:.1f}MB, {overlaid_count} frames with overlays)", file=sys.stderr)


def find_ffmpeg() -> str:
    import os, shutil
    from_env = os.environ.get("FFMPEG_PATH")
    if from_env and os.path.isfile(from_env):
        return from_env
    on_path = shutil.which("ffmpeg")
    if on_path:
        return on_path
    for p in ["/Users/moronireis/Library/Python/3.9/bin/ffmpeg"]:
        if os.path.isfile(p):
            return p
    raise FileNotFoundError("ffmpeg not found")


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Motion graphics overlay for video creatives.")
    p.add_argument("--input", type=Path, required=True, help="Source video (ideally already captioned).")
    p.add_argument("--transcript", type=Path, required=True, help="Whisper JSON transcript.")
    p.add_argument("--output", type=Path, required=True, help="Output video path.")
    return p.parse_args()


def main() -> int:
    args = parse_args()

    if not args.input.exists():
        print(f"ERROR: input not found: {args.input}", file=sys.stderr)
        return 1

    ffmpeg = find_ffmpeg()
    print(f"[motion] Using ffmpeg: {ffmpeg}", file=sys.stderr)
    print(f"[motion] Source: {args.input.name}", file=sys.stderr)

    # Define elements (hardcoded for demo — future: auto-generate from transcript keywords)
    elements = define_elements_for_89C01EA6()
    print(f"[motion] {len(elements)} animated elements defined", file=sys.stderr)

    composite_frames(
        args.input,
        elements,
        args.output,
        ffmpeg_path=ffmpeg,
    )

    return 0


if __name__ == "__main__":
    sys.exit(main())
