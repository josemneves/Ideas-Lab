// ─────────────────────────────────────────────────────────────
// The only file you need to edit.
// Add a project = copy one object in PROJECTS and change the fields.
// ─────────────────────────────────────────────────────────────

window.SITE = {
  name: "José Maria",
  tagline: "I build small products to test big ideas.",
  intro:
    "Each project below started as a question I couldn't stop thinking about. " +
    "I build fast, ship in public and write down what the evidence changed.",
  links: {
    x: "https://x.com/josemneves_",
    github: "https://github.com/josemneves",
    linkedin: "", // e.g. "https://linkedin.com/in/yourhandle"
    email: "" // optional, e.g. "mailto:you@domain.com"
  }
};

// status: "live" | "building" | "prototype" | "paused"
window.PROJECTS = [
  {
    name: "Recovery Lens",
    pitch: "Turn your WHOOP data export into a clear, visual dashboard, privately in your browser.",
    problem:
      "WHOOP lets you export all your data, but it arrives as raw CSV files that are hard to read. " +
      "Recovery Lens turns them into charts and plain-language takeaways, including which habits " +
      "actually move your recovery. No account and no upload: everything runs on your device.",
    learnt: "", // add the most surprising thing you learnt building it
    status: "live",
    date: "2026-10-11",
    live: "https://recoverylens.vercel.app",
    repo: "", // repo is private; add "https://github.com/josemneves/Idea-1" if you make it public
    image: "", // e.g. "images/recovery-lens.png" (16:10 works best)
    tags: ["Health", "Data viz", "Privacy-first"]
  }
];
