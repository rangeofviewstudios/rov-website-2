// ═══════════════════════════════════════════════════════
// VUE — TOOLKIT NARRATION
//
// Vue's voice, one set of lines per toolkit. Three beats, matching the three
// places a reader needs a hand on this page:
//
//   open      before the craft guide, where they arrive
//   stations  at Part 02, where the tool list starts
//   close     at the bottom, before the history door
//
// Voice check: first person, plain sentences, warm but a little above it all.
// She is the one who has watched a lot of people start. She is never selling
// the tools. See `vueClose` in _volumes/vol-01.ts for the reference register.
//
// Two failure modes to watch for on every rewrite:
//   1. "Not just X, it's Y" as a reflex. Every line across all four crafts
//      used to open with some version of "X is not Y" — reserve contrast for
//      when it's actually earned, not as the default sentence shape.
//   2. 100% aphorism density. A line doesn't have to sound quotable to be
//      good; some sentences should just plainly say the thing. If every line
//      is trying to be a mic-drop, none of them land.
// ═══════════════════════════════════════════════════════

export interface VueNarration {
  open: string;
  stations: string;
  close: string;
}

export const VUE_NARRATION: Record<string, VueNarration> = {
  music: {
    open: "Most people start by buying something. Put that off. Your room, your takes, and your own ears will do more for the sound than any plugin here. Come back for the gear once you've actually hit the ceiling on those.",
    stations:
      "This is what our engineers actually reach for, in the order they reach for it. Nothing is on this list because someone paid for it to be.",
    close: "You won't hear the difference on the first pass. That's normal. Keep going.",
  },
  "web-dev": {
    open: "Every stack argument you read this week was about taste, not capability. Pick the one you'll still understand in six months.",
    stations: "Framework down to deploy, in the order you'll actually meet them. We ship with all of it.",
    close: "The stack is the easy part. Shipping is the part nobody writes threads about.",
  },
  design: {
    open: "You already have taste, you use it every time you like one thing over another. These tools don't hand you taste. They get out of its way.",
    stations: "Interface, brand, 3D, and the bits in between. Every pick here has survived a real client.",
    close: "Make the ugly version first. It's the fastest way to find the good one.",
  },
  video: {
    open: "Most people buy a camera first. Learn to see light first, where it's coming from, what it's doing to a face. The camera just records the decision you already made.",
    stations: "Bodies, glass, grip, then the room where it gets finished. In that order, on purpose.",
    close: "Cinematic is a craft you build, not a setting you buy. Shoot enough and you stop needing to be told that.",
  },
};

export const vueNarration = (toolkitId: string): VueNarration | null =>
  VUE_NARRATION[toolkitId] ?? null;
