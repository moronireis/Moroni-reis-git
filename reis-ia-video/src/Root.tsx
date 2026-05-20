import "./index.css";
import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { ReelsShort } from "./ReelsShort";
import { ReisPromo } from "./ReisPromo";
import { ZoomBg } from "./ZoomBg";
import { AgentesDemo } from "./AgentesDemo";
import { AgentesDemoES } from "./AgentesDemoES";
import { NoivaSA } from "./NoivaSA";
import { AdV1, AdV2, AdV3, AdV4, AdV5, AdV6 } from "./VideoAdsES";
import { AdPTBR_V1, AdPTBR_V2, AdPTBR_V3, AdPTBR_V4, AdPTBR_V5, AdPTBR_V6 } from "./VideoAdsPTBR";
import type { Transcript } from "./ReelsShort/types";

import transcriptData from "../public/captions/transcript.json";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        schema={myCompSchema}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      {/* REIS [IA] Reels Short — main production composition */}
      <Composition
        id="ReelsShort"
        component={ReelsShort}
        durationInFrames={Math.ceil((transcriptData as Transcript).duration * 30) + 15}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          transcript: transcriptData as Transcript,
        }}
      />

      {/* Zoom virtual background — 30s loop, 1920x1080 */}
      <Composition
        id="ZoomBg"
        component={ZoomBg}
        durationInFrames={30 * 30}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* REIS [IA] Promo — 15s vertical brand reveal */}
      <Composition
        id="ReisPromo"
        component={ReisPromo}
        durationInFrames={15 * 30}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* AGENTES [IA] Demo — 50s vertical (mobile) product demo */}
      <Composition
        id="AgentesDemo"
        component={AgentesDemo}
        durationInFrames={1500}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* AGENTES [IA] Demo ES — 43s vertical Spanish version */}
      <Composition
        id="AgentesDemoES"
        component={AgentesDemoES}
        durationInFrames={43 * 30}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Noiva S/A — 52s vertical wedding ad creative */}
      <Composition
        id="NoivaSA"
        component={NoivaSA}
        durationInFrames={52 * 30}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Video Ads ES — 6 short-form vertical ad compositions */}
      <Composition
        id="AdV1-ChatGPT"
        component={AdV1}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AdV2-Proyectos"
        component={AdV2}
        durationInFrames={750}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AdV3-Costo"
        component={AdV3}
        durationInFrames={690}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AdV4-Velocidad"
        component={AdV4}
        durationInFrames={690}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AdV5-Squads"
        component={AdV5}
        durationInFrames={840}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AdV6-SinProgramar"
        component={AdV6}
        durationInFrames={810}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Video Ads PT-BR — 6 short-form vertical ad compositions */}
      <Composition
        id="AdPTBR-V1-Squads"
        component={AdPTBR_V1}
        durationInFrames={840}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AdPTBR-V2-SemProgramar"
        component={AdPTBR_V2}
        durationInFrames={750}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AdPTBR-V3-Velocidade"
        component={AdPTBR_V3}
        durationInFrames={630}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AdPTBR-V4-ProjetosReais"
        component={AdPTBR_V4}
        durationInFrames={780}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AdPTBR-V5-CustoEquipe"
        component={AdPTBR_V5}
        durationInFrames={660}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AdPTBR-V6-ChatGPT"
        component={AdPTBR_V6}
        durationInFrames={930}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91dAE2" as const,
          logoColor2: "#86A8E7" as const,
        }}
      />
    </>
  );
};
