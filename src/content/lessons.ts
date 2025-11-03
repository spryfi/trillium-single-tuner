import { PersonParts } from "../utils/trillium";

export const labsLessons: {
  key: string;
  title: string;
  defaultMode?: "CDP"|"TM";
  cards: { title: string; body: string; points?: string[] }[];
  sample: { original: string; parts: PersonParts };
}[] = [
  {
    key: "anatomy",
    title: "Pattern anatomy (CDP vs TM)",
    defaultMode: "CDP",
    cards: [
      {
        title: "CDP (NAME)",
        body: "Two lines. Line 1: inbound token shape. Line 2: REC='…' with name numbers on each NAME attribute (e.g., GVN-NM1(1), SRNM(1)).",
        points: ["Keep REC value free of = ' \" ,", "Tokens allowed: ALPHA, CONCATENEE, CONNECTOR, GENERATION"]
      },
      {
        title: "TM / CLWDPAT (NAME)",
        body: "Three lines. INSERT PATTERN NAME DEF, then RECODE='…', then EXPORT='…'. EXPORT is required for NAME.",
        points: ["REC and EXPORT token counts must match", "Use (1) on EXPORT items"]
      },
      {
        title: "Particles & connector",
        body: "Multi-word particles (DE LA / VAN DER) are CONCATENEE; CONNECTOR (Y) joins people, not a single surname."
      },
      {
        title: "PREPOS",
        body: "Preview Surname1/2/3 to sanity-check the effect of your pattern."
      }
    ],
    sample: {
      original: "DE LA ROSA ANNA MARIE",
      parts: { first: "ANNA", middle: "MARIE", last: "DE LA ROSA" }
    }
  },
  {
    key: "surname-first",
    title: "Surname-first layouts",
    defaultMode: "TM",
    cards: [
      { title: "Surname-first", body: "Some feeds place surname first. Pattern still groups particles as CONCATENEE and maps each to LAST." },
      { title: "Guideline", body: "Prefer the most-specific inbound pattern before general templates." }
    ],
    sample: {
      original: "VAN DER MEER JAN PIETER",
      parts: { first: "JAN", middle: "PIETER", last: "VAN DER MEER" }
    }
  },
  {
    key: "prefix-gen",
    title: "Prefix & generation",
    defaultMode: "CDP",
    cards: [
      { title: "Prefix/TITLE", body: "Mapped to TITLE (CDP) or TITLE/EXPORT in TM." },
      { title: "Generation", body: "JR, SR, II, III etc. Map to GENR (CDP) or GENERATION (TM)." }
    ],
    sample: {
      original: "DR JOHN O CONNOR JR",
      parts: { prefix:"DR", first:"JOHN", last:"O CONNOR", gen:"JR" }
    }
  }
];
