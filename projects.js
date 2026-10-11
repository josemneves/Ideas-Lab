// The only file you need to edit.
// To add a project, copy one object in PROJECTS and add it at the END of the list.
// Numbers (01, 02...) follow the order of this list; the page shows the newest first.

window.SITE = {
  name: "José Maria",
  intro:
    "I build small tools around problems I run into, put them online, " +
    "and write down what I learn. This is the index of everything I have shipped so far.",
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
    pitch: "Turns a WHOOP data export into a visual dashboard, without the data leaving your browser.",
    problem:
      "WHOOP lets you export all your data, but it arrives as raw CSV files that are hard to read. " +
      "Recovery Lens turns them into charts and plain-language takeaways, including which habits " +
      "change your next-day recovery. There is no account and no upload; everything runs on your device.",
    learnt: "", // the most surprising thing you learnt building it
    status: "live",
    date: "2026-10-11",
    live: "https://recoverylens.vercel.app",
    repo: "", // private for now; add "https://github.com/josemneves/Idea-1" if you make it public
    image: "images/recovery-lens.jpg",
    imageAlt: "Recovery Lens dashboard with demo data: recovery, HRV, resting heart rate and sleep tiles above a bar chart of daily recovery",
    tags: ["Health", "Data viz", "Privacy"]
  }
];
