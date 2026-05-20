export interface TranscriptWord {
  word: string;
  start: number;
  end: number;
  probability: number;
}

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
  words: TranscriptWord[];
}

export interface Transcript {
  source: string;
  language: string;
  duration: number;
  segments: TranscriptSegment[];
  words: TranscriptWord[];
}

export interface ReelsShortProps {
  videoSrc: string;
  transcript: Transcript;
}

// REIS [IA] Brand Tokens
export const BRAND = {
  blue: "#4A90FF" as string,
  white: "#FFFFFF" as string,
  black: "#000000" as string,
  darkBg: "rgba(0, 0, 0, 0.75)" as string,
  fontFamily: "Inter, sans-serif" as string,
};
