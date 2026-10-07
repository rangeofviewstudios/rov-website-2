// Content for rovmusic.com/toolkit ("How we make records").
//
// Deliberately NOT shared with app/ctrla/data.ts. The CTRL A music toolkit is a
// community artifact: a flat grid of picks plus the history of recorded sound.
// This page is the commercial page for the music host and walks the actual
// process a song goes through with us, mix to release and every round after.
//
// Keep the copy short and in our voice. Each stage is a headline, two or three
// short points, and one outcome line. No paragraphs. The pictures do the rest.

export type StageVisual =
    | { kind: "photo"; src: string; alt: string; session?: "profile" | "midPhrase" | "knit" | "street" | "eyesClosed" }
    | { kind: "grid"; items: { src: string; alt: string; tag: string }[] }
    | { kind: "kit" }
    | { kind: "email" };

export interface ProcessStage {
    step: string;
    /** Short stage name, used as the eyebrow. */
    name: string;
    /** The one line people remember. */
    title: string;
    /** Two or three short lines. One idea each, read at a glance. */
    points: string[];
    /** What the artist walks away with. Set in ink as the accent line. */
    outcome: string;
    /** Optional small tags under the copy. */
    tags?: string[];
    /** Optional link to real work that shows this stage done. */
    proof?: { label: string; href: string };
    visual: StageVisual;
}

export const processStages: ProcessStage[] = [
    {
        step: "01",
        name: "Mix",
        title: "Get the song right first.",
        points: [
            "We build the record around your vocal.",
            "Tuned by hand, cleaned up before anything gets added.",
            "You hear passes as we go. No big reveal at the end.",
        ],
        outcome: "A mix you've already signed off on.",
        tags: ["Hand-tuned vocals", "Pro-Q", "LA-2A", "EchoBoy"],
        visual: { kind: "photo", src: "/soundpage/session-02.webp", alt: "A vocalist mid-phrase at the mic during a session", session: "midPhrase" },
    },
    {
        step: "02",
        name: "Master",
        title: "Make it hold up everywhere.",
        points: [
            "Mastered for streaming, not a loudness war.",
            "Checked in the car, on earbuds, and on a phone.",
        ],
        outcome: "A master that sounds right wherever it plays.",
        visual: { kind: "photo", src: "/soundpage/session-01.webp", alt: "A vocalist in a beanie singing into a condenser mic at night", session: "profile" },
    },
    {
        step: "03",
        name: "Shoot",
        title: "One day, a stack of clips.",
        points: [
            "Shot in one batch while the master settles.",
            "Performance takes, the hook from five angles, the in-between moments.",
        ],
        outcome: "Weeks of posts from one good day.",
        visual: { kind: "photo", src: "/thumbnails/studiothumbnail.webp", alt: "A session in the studio with the day's shot list on the whiteboard" },
    },
    {
        step: "04",
        name: "Edit and test",
        title: "Post, watch, keep what works.",
        points: [
            "We cut the clips and post them before the song is out.",
            "The ones people stop for go to the main grid.",
            "The rest get retired, and we learn from them.",
        ],
        outcome: "A grid built on what actually worked.",
        visual: {
            kind: "grid",
            items: [
                { src: "/thumbnails/ykwiw1.webp", alt: "Short-form clip from the YKWIW shoot", tag: "Test" },
                { src: "/heroassets/samxbasuvid.webp", alt: "Short-form clip from Sam Suen's autumn shoot", tag: "Main grid" },
                { src: "/thumbnails/starboythumb.webp", alt: "Short-form clip from the Starboy shoot", tag: "Test" },
            ],
        },
    },
    {
        step: "05",
        name: "Release kit",
        title: "Ready before the song is.",
        points: [
            "Cover art, lyric video, and lyrics, done early.",
            "Website updated, every link in place.",
        ],
        outcome: "Release week is posting, not scrambling.",
        visual: { kind: "kit" },
    },
    {
        step: "06",
        name: "Pitch",
        title: "The emails are already written.",
        points: [
            "Curators, blogs, and the people who backed you last time.",
            "Pitches drafted and templated before release.",
        ],
        outcome: "They go out the day it drops, not a week late.",
        visual: { kind: "email" },
    },
    {
        step: "07",
        name: "Run it back",
        title: "Again, until the streams move. Then the next one.",
        points: [
            "Numbers not there yet? Another round: new clips, new angles, another push.",
            "When they are, we start on the next record.",
        ],
        outcome: "Then we do it all again.",
        // Stays /sound/sam-suen: on the music host it 308s to /sam-suen, and
        // /sam-suen alone would 404 in dev and on rovstudios.
        proof: { label: "See a full rollout: Sam Suen", href: "/sound/sam-suen" },
        visual: { kind: "photo", src: "/ctrla/VOL1/dreamasiafestpic2.webp", alt: "Sam Suen on stage at DreamAsia Festival" },
    },
];

/** Six finished covers, shown in the release-kit stage. */
export const kitCovers = [
    { src: "/audio/covers/backintimecover.webp", alt: "Back In Time cover, Sam Suen" },
    { src: "/audio/covers/gimmeyourlovecober.webp", alt: "Give Me Your Love cover, Lorenzo Barns" },
    { src: "/audio/covers/martyrcover.webp", alt: "Martyr cover, DDK" },
    { src: "/audio/covers/talkmyshitcover.webp", alt: "Talk My Shit cover, DDK" },
    { src: "/audio/covers/guapcover.webp", alt: "Guap cover, Dafes" },
    { src: "/audio/covers/ykwiwcover.webp", alt: "YKWIW cover, Basu" },
];

export const toolkitFaqs: { question: string; answer: string }[] = [
    {
        question: "Do I have to do the whole process?",
        answer: "No. Plenty of artists just want the mix and master, and that's fine. The rest is there when you want it, and it's the same team either way.",
    },
    {
        question: "What do you need from me to start?",
        answer: "Stems exported from bar one, named plainly, plus two or three songs that sound like where you want this to land. That's enough for a first pass.",
    },
    {
        question: "How long does it take?",
        answer: "A first mix is usually back inside 48 hours. A full rollout, from shoot to release day, typically runs a few weeks, depending on how much content we're making.",
    },
    {
        question: "Do you work with artists outside Atlanta?",
        answer: "Yes. Mixing and mastering are remote by default. Shoots and studio time happen here in Atlanta.",
    },
];
