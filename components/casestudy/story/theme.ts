/**
 * One theme per client. ROV's dark canvas and type system, wearing the
 * client's color. `accent` is the brand color on black (headlines, rules,
 * the live link), `ink` is what the handwritten notes are written in, and
 * `paper` is the single light ground used for the receipt and the closer.
 */
export type StoryTheme = {
    bg: string;
    /** Body and heading color on the dark ground. */
    text: string;
    accent: string;
    ink: string;
    /** Light ground for the receipt and the closing CTA. */
    paper: string;
    /** Text color on paper. */
    paperInk: string;
    /** Accent on paper, where the on-black accent may be too bright. */
    paperAccent: string;
    display: string;
    heading: string;
    body: string;
    label: string;
};

export const ROV_TYPE = {
    display: "'NorwigeExtraBoldItalic_Hero', 'Norwige', sans-serif",
    heading: "'Norwige', sans-serif",
    body: "'Inter', sans-serif",
    label: "'Neue Montreal', 'Inter', sans-serif",
} as const;

export const HAND_FONT = 'var(--font-caveat), "Segoe Script", "Bradley Hand", cursive';

export const CREAM = "#FFF4E3";
export const ESPRESSO = "#3B2114";

export function makeTheme(overrides: Partial<StoryTheme> & Pick<StoryTheme, "accent">): StoryTheme {
    return {
        bg: "#000000",
        text: CREAM,
        ink: overrides.accent,
        paper: CREAM,
        paperInk: ESPRESSO,
        paperAccent: overrides.accent,
        ...ROV_TYPE,
        ...overrides,
    };
}

/** rgba() of the theme text color, for hairlines and tinted cards. */
export function tint(hex: string, alpha: number) {
    const h = hex.replace("#", "");
    const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}
