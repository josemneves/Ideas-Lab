(function () {
  const site = window.SITE || {};
  const projects = (window.PROJECTS || []).slice().sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  document.title = site.name ? `${site.name} · Projects` : "Projects";
  $("name").textContent = site.name || "";
  $("tagline").textContent = site.tagline || "";
  $("intro").textContent = site.intro || "";
  $("year").textContent = new Date().getFullYear();

  const labels = { x: "X", github: "GitHub", linkedin: "LinkedIn", email: "Email" };
  $("social").innerHTML = Object.entries(site.links || {})
    .filter(([, url]) => url)
    .map(([k, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener">${labels[k] || esc(k)}</a>`)
    .join("");

  const order = ["all", "live", "building", "prototype", "paused"];
  const present = new Set(projects.map((p) => p.status));
  const filters = order.filter((s) => s === "all" || present.has(s));
  let active = "all";

  function fmtDate(d) {
    if (!d) return "";
    const dt = new Date(d + "T00:00:00");
    return isNaN(dt) ? esc(d) : dt.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  }

  function card(p) {
    const initials = (p.name || "?").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const thumb = p.image
      ? `<img src="${esc(p.image)}" alt="${esc(p.name)} screenshot" loading="lazy">`
      : `<span class="ph">${esc(initials)}</span>`;
    const more = p.problem || p.learnt
      ? `<details><summary>Problem &amp; learnings</summary>
           ${p.problem ? `<p><strong>Problem.</strong> ${esc(p.problem)}</p>` : ""}
           ${p.learnt ? `<p><strong>Learnt.</strong> ${esc(p.learnt)}</p>` : ""}
         </details>`
      : "";
    const tags = (p.tags || []).length ? `<div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>` : "";
    const live = p.live
      ? `<a class="btn primary" href="${esc(p.live)}" target="_blank" rel="noopener">Try it ↗</a>`
      : `<span class="btn disabled">Demo soon</span>`;
    const repo = p.repo ? `<a class="btn" href="${esc(p.repo)}" target="_blank" rel="noopener">GitHub</a>` : "";
    return `<article class="card">
      <div class="thumb">${thumb}</div>
      <div class="body">
        <div class="meta"><span class="status ${esc(p.status)}">${esc(p.status)}</span><span class="mono">${fmtDate(p.date)}</span></div>
        <h3>${esc(p.name)}</h3>
        <p class="pitch">${esc(p.pitch)}</p>
        ${more}${tags}
        <div class="actions">${live}${repo}</div>
      </div>
    </article>`;
  }

  function render() {
    $("filters").innerHTML = filters.length > 2
      ? filters.map((f) => `<button role="tab" data-f="${f}" aria-selected="${f === active}">${f[0].toUpperCase() + f.slice(1)}</button>`).join("")
      : "";
    const list = projects.filter((p) => active === "all" || p.status === active);
    $("count").textContent = `(${projects.length})`;
    $("grid").innerHTML = list.length ? list.map(card).join("") : `<p class="empty">Nothing here yet — check back soon.</p>`;
  }

  $("filters").addEventListener("click", (e) => {
    const f = e.target.closest("button")?.dataset.f;
    if (f) { active = f; render(); }
  });

  render();
})();
