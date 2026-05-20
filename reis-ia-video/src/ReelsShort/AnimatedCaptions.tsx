import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import type { TranscriptWord } from "./types";
import { BRAND } from "./types";

const HIGHLIGHT_WORDS = new Set([
  "agentes", "agente", "quarenta", "40", "profissional", "premium",
  "resultado", "resultados", "47", "reais", "exclusivas", "automatizar",
  "aplicativos", "aplicativo", "design", "tráfego", "tráfico",
  "cloud", "code", "site", "oportunidade", "melhor", "mercado",
  "funcionários", "operação", "receita", "aulas",
]);

function isHighlight(word: string): boolean {
  return HIGHLIGHT_WORDS.has(word.toLowerCase().replace(/[.,!?]/g, ""));
}

// Group words into display lines (~4-5 words)
function groupWords(
  words: TranscriptWord[],
  max = 4
): { words: TranscriptWord[]; start: number; end: number }[] {
  const lines: { words: TranscriptWord[]; start: number; end: number }[] = [];
  let buf: TranscriptWord[] = [];

  for (const w of words) {
    buf.push(w);
    if (buf.length >= max) {
      lines.push({
        words: [...buf],
        start: buf[0].start,
        end: buf[buf.length - 1].end,
      });
      buf = [];
    }
  }
  if (buf.length > 0) {
    lines.push({
      words: [...buf],
      start: buf[0].start,
      end: buf[buf.length - 1].end,
    });
  }
  return lines;
}

export const AnimatedCaptions: React.FC<{
  words: TranscriptWord[];
}> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const lines = groupWords(words, 4);

  // Find active line
  const activeLine = lines.find(
    (l) => t >= l.start - 0.05 && t <= l.end + 0.4
  );
  if (!activeLine) return null;

  const lineFrame = Math.floor(activeLine.start * fps);

  // Line container: slide up + fade in
  const slideUp = spring({
    frame: frame - lineFrame,
    fps,
    config: { damping: 13, stiffness: 160, mass: 0.5 },
  });

  // Line exit: fade out when next line is about to start
  const lineEndDist = t - activeLine.end;
  const lineExitOpacity =
    lineEndDist > 0.2
      ? interpolate(lineEndDist, [0.2, 0.4], [1, 0], {
          extrapolateRight: "clamp",
        })
      : 1;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 300,
        left: 40,
        right: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: lineExitOpacity,
        transform: `translateY(${interpolate(slideUp, [0, 1], [30, 0])}px)`,
      }}
    >
      {/* Background pill */}
      <div
        style={{
          display: "inline-flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "6px 10px",
          padding: "14px 28px",
          borderRadius: 16,
          backgroundColor: "rgba(0, 0, 0, 0.65)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
          transform: `scale(${slideUp})`,
        }}
      >
        {activeLine.words.map((word, i) => {
          const isActive = t >= word.start && t <= word.end + 0.12;
          const isPast = t > word.end + 0.12;
          const hl = isHighlight(word.word);

          const wFrame = Math.floor(word.start * fps);
          const wPop = spring({
            frame: frame - wFrame,
            fps,
            config: { damping: 10, stiffness: 220, mass: 0.35 },
          });

          // Active word gets blue + scale bump
          // Highlight words get extra glow
          let color = "rgba(255,255,255,0.45)";
          let scale = 1;
          let textShadow = "none";
          let fontSz = 58;

          if (isActive) {
            color = BRAND.blue;
            scale = hl ? 1.25 : 1.12;
            fontSz = hl ? 68 : 62;
            textShadow = hl
              ? `0 0 20px rgba(74,144,255,0.8), 0 0 40px rgba(74,144,255,0.4), 0 2px 4px rgba(0,0,0,0.9)`
              : `0 0 12px rgba(74,144,255,0.5), 0 2px 4px rgba(0,0,0,0.9)`;
          } else if (isPast) {
            color = BRAND.white;
            textShadow = "0 1px 3px rgba(0,0,0,0.6)";
          }

          return (
            <span
              key={`${word.start}-${i}`}
              style={{
                fontFamily: BRAND.fontFamily,
                fontWeight: 800,
                fontSize: fontSz,
                color,
                textShadow,
                transform: `scale(${scale * Math.min(wPop, 1)})`,
                opacity: interpolate(wPop, [0, 0.5, 1], [0, 0.8, 1], {
                  extrapolateRight: "clamp",
                }),
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                textTransform: hl && isActive ? "uppercase" : "none",
              }}
            >
              {word.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
