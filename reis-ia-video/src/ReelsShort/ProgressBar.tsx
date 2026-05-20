import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { BRAND } from "./types";

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames], [0, 100], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          backgroundColor: BRAND.blue,
          boxShadow: `0 0 12px ${BRAND.blue}`,
        }}
      />
    </div>
  );
};
