import { Fraunces, IBM_Plex_Sans, IBM_Plex_Serif, Inter, JetBrains_Mono, Lora, Source_Serif_4 } from "next/font/google";

/* UI fonts */
export const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
export const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", axes: ["opsz"] });

/* Document font keys: source-serif, inter, ibm-plex-sans, ibm-plex-serif, lora, jetbrains-mono */
export const sourceSerif = Source_Serif_4({ subsets: ["latin"], variable: "--font-source-serif", display: "swap", style: ["normal", "italic"] });
export const ibmPlexSans = IBM_Plex_Sans({ subsets: ["latin"], variable: "--font-ibm-plex-sans", weight: ["400", "500", "600", "700"], display: "swap" });
export const ibmPlexSerif = IBM_Plex_Serif({ subsets: ["latin"], variable: "--font-ibm-plex-serif", weight: ["400", "500", "600", "700"], style: ["normal", "italic"], display: "swap" });
export const lora = Lora({ subsets: ["latin"], variable: "--font-lora", style: ["normal", "italic"], display: "swap" });
export const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });

export const fontVariables = [inter, fraunces, sourceSerif, ibmPlexSans, ibmPlexSerif, lora, jetbrainsMono]
  .map((f) => f.variable)
  .join(" ");
