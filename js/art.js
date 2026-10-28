/* Visuals: project screenshots (light/dark aware), framed previews,
   the "classified" placeholder for empty grid slots, and the logo. */
window.Art = (function () {
  var n = 0;
  function uid() { return 'g' + (++n).toString(36); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function host(url) {
    try { return new URL(url).host.replace(/^www\./, ''); } catch (e) { return ''; }
  }

  // Screenshot that follows the visitor's light/dark setting.
  // image: 'x.jpg' | { light: 'x.jpg', dark: 'y.jpg' } (either key may be missing)
  function picture(p, alt, lazy) {
    var im = typeof p.image === 'string' ? { light: p.image } : (p.image || {});
    var light = im.light || im.dark, dark = im.dark;
    if (!light) return '';
    return '<picture>' +
      (dark && dark !== light ? '<source media="(prefers-color-scheme: dark)" srcset="' + esc(dark) + '">' : '') +
      '<img src="' + esc(light) + '" alt="' + esc(alt == null ? (p.imageAlt || p.name) : alt) + '"' + (lazy === false ? '' : ' loading="lazy"') + '>' +
      '</picture>';
  }

  // Browser-window frame around a project screenshot
  function shot(p) {
    var url = host(p.live) || p.handle;
    return '<figure class="shot">' +
      '<div class="shot__bar"><i></i><i></i><i></i><span>' + esc(url) + '</span></div>' +
      (picture(p) || '<div class="shot__empty">No preview</div>') +
      '</figure>';
  }

  // Redacted document in the same frame, for empty slots
  function classified(seed) {
    var u = uid(), bars = '', y = 34, r = seed * 9301 + 49297;
    function rnd() { r = (r * 9301 + 49297) % 233280; return r / 233280; }
    while (y < 230) {
      var x = 26, w;
      while (x < 330) {
        w = 18 + rnd() * 70;
        if (x + w > 374) w = 374 - x;
        bars += '<rect x="' + x.toFixed(1) + '" y="' + y + '" width="' + w.toFixed(1) + '" height="7" fill="' + (rnd() > 0.72 ? '#0d0d0d' : '#3a3a3a') + '"/>';
        x += w + 6;
      }
      y += rnd() > 0.82 ? 26 : 15;
    }
    return '<figure class="shot shot--classified">' +
      '<div class="shot__bar"><i></i><i></i><i></i><span>restricted</span></div>' +
      '<svg viewBox="0 0 400 250" aria-hidden="true"><defs>' +
      '<filter id="' + u + '-n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="' + seed + '"/><feColorMatrix type="saturate" values="0"/></filter></defs>' +
      '<rect width="400" height="250" fill="#232323"/>' + bars +
      '<rect width="400" height="250" filter="url(#' + u + '-n)" opacity=".08"/>' +
      '<g transform="rotate(-8 200 125)"><rect x="104" y="100" width="192" height="46" fill="none" stroke="#c9432c" stroke-width="2.5"/>' +
      '<text x="200" y="131" text-anchor="middle" font-family="\'Geist Mono\', Menlo, monospace" font-size="20" letter-spacing="5" fill="#c9432c">CLASSIFIED</text></g>' +
      '</svg></figure>';
  }

  // The "i" mark: red square dot (the idea) over a stem (the work)
  function logo() {
    return '<svg viewBox="25 6 14 52" aria-hidden="true"><rect x="25" y="6" width="14" height="14" fill="#c9432c"/>' +
      '<rect x="25" y="26" width="14" height="32" fill="currentColor"/></svg>';
  }

  return { shot: shot, picture: picture, classified: classified, logo: logo, host: host };
})();
