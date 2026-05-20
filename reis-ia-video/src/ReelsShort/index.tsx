import React from "react";
import {
  OffthreadVideo,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";
import { AnimatedCaptions } from "./AnimatedCaptions";
import { ProgressBar } from "./ProgressBar";
import type { Transcript, TranscriptWord } from "./types";
import { BRAND } from "./types";

// Detect "punch" moments — keywords that trigger zoom + flash
const PUNCH_WORDS = new Set([
  "agentes", "agente", "quarenta", "40", "profissional", "premium",
  "resultado", "resultados", "47", "reais", "exclusivas", "automatizar",
  "aplicativos", "aplicativo", "tudo", "pronto", "melhor",
]);

function getPunchMoments(words: TranscriptWord[]): number[] {
  return words
    .filter((w) => PUNCH_WORDS.has(w.word.toLowerCase().replace(/[.,!?]/g, "")))
    .map((w) => w.start);
}

export const ReelsShort: React.FC<{
  transcript: Transcript;
}> = ({ transcript }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const currentTime = frame / fps;

  const punchMoments = getPunchMoments(transcript.words);

  // --- ZOOM: base slow zoom + punch bursts on keywords ---
  const baseZoom = interpolate(frame, [0, durationInFrames], [1.0, 1.06], {
    extrapolateRight: "clamp",
  });

  let punchZoom = 0;
  for (const t of punchMoments) {
    const dist = currentTime - t;
    if (dist >= 0 && dist < 0.4) {
      const punch = spring({
        frame: frame - Math.floor(t * fps),
        fps,
        config: { damping: 8, stiffness: 300, mass: 0.3 },
      });
      punchZoom = Math.max(punchZoom, punch * 0.08);
    }
  }
  const zoom = baseZoom + punchZoom;

  // --- SHAKE: micro-shake on punch moments ---
  let shakeX = 0;
  let shakeY = 0;
  for (const t of punchMoments) {
    const dist = currentTime - t;
    if (dist >= 0 && dist < 0.25) {
      const intensity = interpolate(dist, [0, 0.25], [6, 0], {
        extrapolateRight: "clamp",
      });
      shakeX = Math.sin(dist * 80) * intensity;
      shakeY = Math.cos(dist * 60) * intensity;
    }
  }

  // --- FLASH: white flash on punch ---
  let flashOpacity = 0;
  for (const t of punchMoments) {
    const dist = currentTime - t;
    if (dist >= 0 && dist < 0.15) {
      flashOpacity = Math.max(
        flashOpacity,
        interpolate(dist, [0, 0.15], [0.35, 0], { extrapolateRight: "clamp" })
      );
    }
  }

  // --- FADE in/out ---
  const fadeIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // --- LOWER THIRD entry ---
  const lowerThirdIn = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.6 },
  });
  const lowerThirdOut = interpolate(
    frame,
    [durationInFrames - 45, durationInFrames - 30],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const lowerThirdOpacity = lowerThirdIn * lowerThirdOut;

  // --- WATERMARK ---
  const watermarkOpacity = interpolate(
    frame,
    [0, 20, durationInFrames - 60, durationInFrames - 30],
    [0, 0.7, 0.7, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // --- BLUE ACCENT LINE (animated) ---
  const accentWidth = interpolate(frame, [5, 25], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: BRAND.black,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Main video with zoom + shake + punch */}
      <div
        style={{
          position: "absolute",
          inset: -20,
          opacity: fadeIn * fadeOut,
          transform: `scale(${zoom}) translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        <OffthreadVideo
          src={staticFile("video/source.mov")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Cinematic color grade overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,10,30,0.15) 0%, transparent 30%, transparent 70%, rgba(0,5,20,0.2) 100%)",
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Bottom gradient for captions */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 600,
          background:
            "linear-gradient(transparent, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.85) 80%, rgba(0,0,0,0.95))",
          pointerEvents: "none",
        }}
      />

      {/* FLASH overlay */}
      {flashOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: BRAND.white,
            opacity: flashOpacity,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Blue accent flash (on punch) */}
      {flashOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            boxShadow: `inset 0 0 120px 30px rgba(74, 144, 255, ${flashOpacity * 0.6})`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Animated captions */}
      <AnimatedCaptions words={transcript.words} />

      {/* Progress bar */}
      <ProgressBar />

      {/* Top accent line (animated entry) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: `${accentWidth}%`,
          height: 3,
          backgroundColor: BRAND.blue,
          boxShadow: `0 0 15px ${BRAND.blue}, 0 0 30px rgba(74, 144, 255, 0.3)`,
        }}
      />

      {/* Lower-third: name + handle */}
      <div
        style={{
          position: "absolute",
          bottom: 160,
          left: 40,
          opacity: lowerThirdOpacity,
          transform: `translateX(${interpolate(lowerThirdIn, [0, 1], [-40, 0])}px)`,
        }}
      >
        {/* Blue accent bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 4,
              height: 48,
              backgroundColor: BRAND.blue,
              borderRadius: 2,
              boxShadow: `0 0 8px ${BRAND.blue}`,
            }}
          />
          <div>
            <div
              style={{
                fontFamily: BRAND.fontFamily,
                fontWeight: 700,
                fontSize: 28,
                color: BRAND.white,
                letterSpacing: "0.02em",
                textShadow: "0 2px 8px rgba(0,0,0,0.8)",
              }}
            >
              Moroni Reis
            </div>
            <div
              style={{
                fontFamily: BRAND.fontFamily,
                fontWeight: 400,
                fontSize: 20,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "0.04em",
                textShadow: "0 1px 4px rgba(0,0,0,0.8)",
              }}
            >
              @moronireis
            </div>
          </div>
        </div>
      </div>

      {/* REIS [IA] watermark */}
      <div
        style={{
          position: "absolute",
          top: 50,
          right: 40,
          opacity: watermarkOpacity,
        }}
      >
        <span
          style={{
            fontFamily: BRAND.fontFamily,
            fontWeight: 300,
            fontSize: 24,
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.8)",
            textShadow: "0 1px 6px rgba(0,0,0,0.6)",
          }}
        >
          REIS <span style={{ color: BRAND.blue }}>[IA]</span>
        </span>
      </div>
    </div>
  );
};
