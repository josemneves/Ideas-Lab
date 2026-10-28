/* Visuals: hero backdrop, logo, framed site previews and the
   "classified" placeholder used to fill empty grid slots. */
window.Art = (function () {
  var n = 0;
  function uid() { return 'g' + (++n).toString(36); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function host(url) {
    try { return new URL(url).host.replace(/^www\./, ''); } catch (e) { return ''; }
  }

  // Browser-window frame around a project screenshot
  function shot(p) {
    var url = host(p.live) || p.handle;
    return '<figure class="shot">' +
      '<div class="shot__bar"><i></i><i></i><i></i><span>' + esc(url) + '</span></div>' +
      (p.image
        ? '<img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt || p.name) + '" loading="lazy">'
        : '<div class="shot__empty">No preview</div>') +
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

  // Dark textured surface with a diagonal embroidered-style line of serif type
  function hero(word) {
    var u = uid();
    var rings = '';
    for (var i = 1; i <= 6; i++) rings += '<circle cx="1040" cy="210" r="' + i * 62 + '"/>';
    return '<svg viewBox="0 0 1280 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>' +
      '<linearGradient id="' + u + '-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b3736"/><stop offset=".55" stop-color="#2a2827"/><stop offset="1" stop-color="#1b1a1a"/></linearGradient>' +
      '<radialGradient id="' + u + '-vig" cx=".58" cy=".52" r=".9"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>' +
      '<pattern id="' + u + '-dots" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#fff" opacity=".09"/></pattern>' +
      '<pattern id="' + u + '-twill" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)"><rect width="1.6" height="5" fill="#000" opacity=".1"/></pattern>' +
      '<pattern id="' + u + '-stitch" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(46)">' +
      '<rect width="4.5" height="4.5" fill="#e4553d"/><rect width="1.4" height="4.5" fill="#a83324" opacity=".6"/><rect x="2.4" width=".9" height="4.5" fill="#ff8c71" opacity=".4"/></pattern>' +
      '<filter id="' + u + '-raise" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx="3" dy="5" stdDeviation="3" flood-color="#000" flood-opacity=".6"/></filter>' +
      '<filter id="' + u + '-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>' +
      '</defs>' +
      '<rect width="1280" height="900" fill="url(#' + u + '-bg)"/>' +
      '<rect width="1280" height="900" fill="url(#' + u + '-twill)"/>' +
      '<rect width="1280" height="900" fill="url(#' + u + '-dots)"/>' +
      '<g fill="none" stroke="#fff" stroke-opacity=".07">' + rings +
      '<path d="M1040 0 V 900 M 0 210 H 1280"/></g>' +
      '<g transform="translate(40 1010) rotate(-42)"><text x="0" y="0" font-family="\'Times New Roman\', Times, serif" font-size="250" letter-spacing="-3" ' +
      'fill="url(#' + u + '-stitch)" filter="url(#' + u + '-raise)">' + esc(word) + '</text></g>' +
      '<rect width="1280" height="900" filter="url(#' + u + '-grain)" opacity=".13" class="blend-overlay"/>' +
      '<rect width="1280" height="900" fill="url(#' + u + '-vig)"/>' +
      '</svg>';
  }

  // The "i" mark: red square dot (the idea) over a stem (the work)
  function logo() {
    return '<svg viewBox="25 6 14 52" aria-hidden="true"><rect x="25" y="6" width="14" height="14" fill="#c9432c"/>' +
      '<rect x="25" y="26" width="14" height="32" fill="currentColor"/></svg>';
  }

  return { shot: shot, classified: classified, hero: hero, logo: logo, host: host };
})();
