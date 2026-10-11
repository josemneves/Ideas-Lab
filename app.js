(function () {
  const site = window.SITE || {};
  const all = window.PROJECTS || [];
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Only allow http(s), mailto and relative links, so a typo can never become a javascript: URL.
  const safeUrl = (u) => (/^(https?:\/\/|mailto:|[\w./-]+$)/i.test(u || "") ? esc(u) : "");
  const ext = 'target="_blank" rel="noopener noreferrer"';

  function fmtDate(d) {
    const dt = new Date((d || "") + "T00:00:00");
    return isNaN(dt) ? "" : dt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  $("name").textContent = site.name || "";
  $("intro").textContent = site.intro || "";

  const labels = { x: "X", github: "GitHub", linkedin: "LinkedIn", email: "Email" };
  $("social").innerHTML = Object.entries(site.links || {})
    .filter(([, url]) => safeUrl(url))
    .map(([k, url]) => `<a href="${safeUrl(url)}" ${k === "email" ? "" : ext}>${labels[k] || esc(k)}</a>`)
    .join("");

  function row(p, i) {
    const live = safeUrl(p.live), repo = safeUrl(p.repo), img = safeUrl(p.image);
    const title = live ? `<a href="${live}" ${ext}>${esc(p.name)}</a>` : esc(p.name);
    const links = [
      live && `<a href="${live}" ${ext}>Visit site<span aria-hidden="true"> ↗</span></a>`,
      repo && `<a href="${repo}" ${ext}>Source code<span aria-hidden="true"> ↗</span></a>`
    ].filter(Boolean).join("");
    return `<li class="row">
      <span class="num" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
      <div>
        <h3>${title}</h3>
        <p class="pitch">${esc(p.pitch)}</p>
        ${p.problem ? `<p class="detail"><strong>Why.</strong> ${esc(p.problem)}</p>` : ""}
        ${p.learnt ? `<p class="detail"><strong>Learnt.</strong> ${esc(p.learnt)}</p>` : ""}
        ${img ? `<figure class="shot"><img src="${img}" alt="${esc(p.imageAlt || p.name + " screenshot")}" loading="lazy"></figure>` : ""}
        ${links ? `<p class="links">${links}</p>` : ""}
      </div>
      <dl class="meta">
        <dt>Status</dt><dd class="status ${esc(p.status)}">${esc((p.status || "").replace(/^./, (c) => c.toUpperCase()))}</dd>
        <dt>Started</dt><dd>${fmtDate(p.date)}</dd>
        ${(p.tags || []).length ? `<dt>Topics</dt><dd>${p.tags.map(esc).join(", ")}</dd>` : ""}
      </dl>
    </li>`;
  }

  const numbered = all.map((p, i) => ({ p, i })).reverse();
  $("count").textContent = `${all.length} ${all.length === 1 ? "project" : "projects"}`;
  $("index").innerHTML = numbered.length
    ? numbered.map(({ p, i }) => row(p, i)).join("")
    : `<li class="empty">Nothing here yet. Check back soon.</li>`;

  const latest = all.map((p) => p.date || "").sort().pop();
  $("updated").textContent = latest ? `Last updated ${fmtDate(latest)}` : "";
})();
