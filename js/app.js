/* Router + views. Hash routes (#/projects/rejuice) so the site works
   straight from the file system and on any static host (GitHub Pages, Vercel). */
(function () {
  var SITE = window.SITE, PROJECTS = window.PROJECTS, Art = window.Art, Term = window.Terminal;
  var view = document.getElementById('view');
  var sidebar = document.getElementById('sidebar');

  var byHandle = {};
  PROJECTS.forEach(function (p, i) { p.index = i; byHandle[p.handle] = p; });

  var STATUS = { live: 'Live', building: 'Building', prototype: 'Prototype', paused: 'Paused' };
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var BGS = ['mid', 'light', 'dark', 'light', 'dark', 'mid'];

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function safeUrl(u) { return /^(https?:|mailto:)/i.test(u || '') ? u : ''; }
  function num(i) { return String(i + 1).padStart(2, '0'); }
  function code(i, p) { return 'IDEA-' + num(i) + (p && p.date ? '-' + p.date.slice(0, 7).replace('-', '') : ''); }
  function month(d) { var m = /^(\d{4})-(\d{2})/.exec(d || ''); return m ? MONTHS[+m[2] - 1] + ' ' + m[1] : '—'; }
  function status(p) { return STATUS[p.status] || p.status || ''; }

  var ARROW_DOWN = '<svg width="12" height="16" viewBox="0 0 12 16" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M6 1v13.5M1 9.5l5 5 5-5"/></svg>';

  /* ---------------------------------------------------------------- tiles */

  function tile(p, mode) {
    var i = p.index, bg = BGS[i % BGS.length];
    var archive = mode === 'archive';
    var info = archive
      ? '<div class="tile__code">' + code(i, p) + '</div>'
      : '<div class="tile__label"><span>' + num(i) + ' — ' + esc(p.name) + '</span><span>' + status(p) + ' · ' + month(p.date) + '</span></div>' +
        '<div class="tile__cta">View project<span class="arr">→</span></div>';
    return '<a class="tile tile--' + bg + (archive ? ' tile--archive' : '') + '" href="#/projects/' + p.handle + '" title="' + esc(p.name) + '">' +
      '<div class="tile__art">' + Art.shot(p) + '</div>' + info + '</a>';
  }

  function classifiedTile(i, mode) {
    var archive = mode === 'archive';
    var info = archive
      ? '<div class="tile__code">' + code(i) + ' — sealed</div>'
      : '<div class="tile__label"><span>' + num(i) + ' — Classified</span><span>Clearance required</span></div>';
    return '<button class="tile tile--dark tile--classified' + (archive ? ' tile--archive' : '') + '" data-action="classified" data-idx="' + num(i) + '" title="Classified">' +
      '<div class="tile__art">' + Art.classified(i + 3) + '</div>' + info + '</button>';
  }

  // projects first, then "classified" slots until the last row is full (min. `min` tiles)
  function grid(list, mode, min) {
    var html = list.map(function (p) { return tile(p, mode); }).join('');
    var total = Math.max(min || 0, Math.ceil(list.length / 3) * 3);
    var next = PROJECTS.length;
    for (var k = list.length; k < total; k++) html += classifiedTile(next++, mode);
    return '<section class="grid" id="index">' + html + '</section>';
  }

  function footer() {
    return '<footer class="foot"><span>© 2026 ' + esc(SITE.name) + '</span>' +
      '<span>Design inspired by store.palantir.com — not affiliated with Palantir Technologies Inc.</span></footer>';
  }

  /* ---------------------------------------------------------------- views */

  function viewLanding() {
    var name = esc(SITE.name).split(' ');
    return '<section class="hero">' +
      '<div class="hero__art">' + Art.hero('Ideas, shipped.') + '</div>' +
      '<div class="hero__tag mono">' + esc(SITE.tagline) + ' — ' + num(PROJECTS.length - 1) + ' projects</div>' +
      '<div class="hero__type"><span class="hero__season">S. 2026</span><h1 class="hero__title">' + name.join('<br>') + '</h1></div>' +
      '<button class="hero__shop" data-action="scroll">PROJECTS ' + ARROW_DOWN + '</button>' +
      '</section>' + grid(PROJECTS, 'index', 3) + footer();
  }

  function viewArchive() {
    return grid(PROJECTS, 'archive', 6) + footer();
  }

  function viewProject(p) {
    var live = safeUrl(p.live), repo = safeUrl(p.repo);
    var others = PROJECTS.filter(function (x) { return x !== p; });
    var specs = [
      ['Status', status(p)],
      ['Launched', month(p.date)],
      ['Tags', (p.tags || []).join(' · ') || '—'],
      ['URL', live ? Art.host(live) : 'Not online yet']
    ].map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('');
    var bg = BGS[p.index % BGS.length];

    return '<article class="pdp">' +
      '<div class="pdp__media">' +
        '<div class="pdp__img tile--' + bg + '">' + Art.shot(p) + '</div>' +
        (p.image ? '<div class="pdp__img pdp__img--full"><img src="' + esc(p.image) + '" alt="" loading="lazy"></div>' : '') +
      '</div>' +
      '<aside class="pdp__info">' +
        '<div class="pdp__top mono"><a href="#/projects">← Projects</a><span>' + code(p.index, p) + '</span></div>' +
        '<div>' +
          '<h1 class="pdp__name">' + esc(p.name) + '</h1>' +
          '<div class="pdp__price mono status status--' + esc(p.status) + '">' + status(p) + ' · ' + month(p.date) + '</div>' +
          '<p class="pdp__pitch">' + esc(p.pitch) + '</p>' +
          '<span class="pdp__label mono">Problem</span><p class="pdp__desc">' + esc(p.problem) + '</p>' +
          (p.learnt ? '<span class="pdp__label mono">What I learnt</span><p class="pdp__desc">' + esc(p.learnt) + '</p>' : '') +
          (live
            ? '<a class="btn-line" href="' + esc(live) + '" target="_blank" rel="noopener" data-action="visit"><span>Visit site</span><span>↗</span></a>'
            : '<button class="btn-line" disabled><span>Not online yet</span><span></span></button>') +
          (repo ? '<a class="btn-line btn-line--ghost" href="' + esc(repo) + '" target="_blank" rel="noopener"><span>Source code</span><span>↗</span></a>' : '') +
          '<dl class="specs">' + specs + '</dl>' +
        '</div>' +
      '</aside>' +
      '</article>' +
      '<div class="section-head mono"><span>More ideas</span><span>' + PROJECTS.length + ' total</span></div>' +
      grid(others, 'index', 3) + footer();
  }

  function viewAbout() {
    var L = SITE.links, rows = [['X', L.x], ['GitHub', L.github], ['LinkedIn', L.linkedin], ['Email', L.email]]
      .filter(function (r) { return safeUrl(r[1]); })
      .map(function (r) {
        var label = r[1].replace(/^mailto:/, '').replace(/^https?:\/\/(www\.)?/, '');
        return '<div><dt>' + r[0] + '</dt><dd><a href="' + esc(r[1]) + '" target="_blank" rel="noopener">' + esc(label) + ' ↗</a></dd></div>';
      }).join('');
    return '<section class="about">' +
      '<header class="about__head"><h1>About</h1><span class="mono">' + num(PROJECTS.length - 1) + ' projects shipped</span></header>' +
      '<div class="about__body">' +
        '<p class="about__name">' + esc(SITE.name) + '</p>' +
        '<p class="about__intro">' + esc(SITE.intro) + '</p>' +
        '<a class="mono" href="#/projects">See the projects →</a>' +
      '</div>' +
      '<div class="about__links"><span class="pdp__label mono">Elsewhere</span><dl class="specs">' + rows + '</dl></div>' +
      '</section>';
  }

  function view404(path) {
    return '<section class="nf"><h1>404</h1><span class="mono">Resource not found: ' + esc(path) + '</span>' +
      '<span class="mono"><a href="#/">Return to index</a></span></section>';
  }

  /* --------------------------------------------------------------- router */

  function currentPath() {
    var h = decodeURIComponent(location.hash.replace(/^#/, '')) || '/';
    h = h.charAt(0) === '/' ? h : '/' + h;
    return h.length > 1 ? h.replace(/\/$/, '') : h;
  }

  function resolve(path) {
    var m;
    if (path === '/' || path === '/projects') {
      return { html: viewLanding, nav: 'projects', term: path === '/' ? '~' : '~/projects', title: SITE.name };
    }
    if ((m = path.match(/^\/projects\/([\w-]+)$/)) && byHandle[m[1]]) {
      var p = byHandle[m[1]];
      return { html: function () { return viewProject(p); }, nav: 'projects', term: '~/projects/' + p.handle, title: p.name, project: p };
    }
    if (path === '/archive') return { html: viewArchive, nav: 'archive', term: '~/archive', title: 'Archive' };
    if (path === '/about') return { html: viewAbout, nav: 'about', term: '~/about', title: 'About' };
    return { html: function () { return view404(path); }, nav: null, term: '~', title: 'Not found', missing: true };
  }

  var booted = false;

  function render() {
    var path = currentPath();
    var r = resolve(path);
    if (booted) Term.log('navigating to ' + path);

    view.classList.remove('is-in');
    view.innerHTML = r.html();
    window.scrollTo(0, 0);
    void view.offsetWidth; // restart the fade-in animation
    view.classList.add('is-in');

    document.title = r.title === SITE.name ? SITE.name : r.title + ' — ' + SITE.name;
    document.querySelectorAll('[data-nav]').forEach(function (a) { a.classList.toggle('is-active', a.dataset.nav === r.nav); });
    Term.setPath(r.term);
    sidebar.classList.remove('is-open');
    document.getElementById('menu-toggle').setAttribute('aria-expanded', 'false');

    if (booted) {
      setTimeout(function () {
        if (r.missing) Term.log('error: route not found', 'tl--err');
        else Term.log('navigation complete');
      }, 90 + Math.random() * 160);
    }
    updatePill();
  }

  function go(path) { location.hash = '#' + path; }

  /* ------------------------------------------------ terminal: ls / cd / open */

  function segments(termPath) { return termPath.replace(/^~\/?/, '').split('/').filter(Boolean); }

  function children(parts) {
    if (!parts.length) return ['projects', 'archive', 'about'];
    if (parts.length === 1 && parts[0] === 'projects') return PROJECTS.map(function (p) { return p.handle; });
    return null;
  }

  // "../archive", "~/projects/rejuice", "rejuice"... -> route
  // relative paths that don't resolve are retried from ~ (so "cd archive" works anywhere)
  function routeFor(arg) {
    return resolvePath(arg, /^[~\/]/.test(arg) ? [] : segments(Term.path)) || resolvePath(arg, []);
  }

  function resolvePath(arg, parts) {
    parts = parts.slice();
    arg.replace(/^~/, '').split('/').forEach(function (seg) {
      if (!seg || seg === '.') return;
      if (seg === '..') parts.pop(); else parts.push(seg.toLowerCase());
    });
    if (!parts.length) return '/';
    if (parts.length === 1 && /^(projects|archive|about)$/.test(parts[0])) return '/' + parts[0];
    var h = parts[parts.length - 1];
    if (byHandle[h] && (parts.length === 1 || (parts.length === 2 && parts[0] === 'projects'))) return '/projects/' + h;
    return null;
  }

  Term.register('ls', {
    usage: 'ls [dir]', desc: 'list directory contents',
    run: function (args) {
      var termPath = Term.path;
      if (args[0]) {
        var route = routeFor(args[0]);
        if (!route) return Term.print('ls: cannot access \'' + args[0] + '\': no such directory', 'tl--err');
        termPath = resolve(route).term;
      }
      var parts = segments(termPath), list = children(parts);
      if (!list) {
        var p = byHandle[parts[parts.length - 1]];
        return Term.print(p ? p.name + ' — ' + status(p) : '(empty)', 'tl--dim');
      }
      if (!parts.length) return Term.print(list.map(function (d) { return d === 'about' ? d : d + '/'; }).join('  '));
      list.forEach(function (h) { Term.print(h, 'tl--dim'); });
    }
  });

  Term.register('cd', {
    usage: 'cd <dir>', desc: 'change directory',
    complete: function () { return (children(segments(Term.path)) || []).concat(['..']); },
    run: function (args) {
      var route = routeFor(args[0] || '~');
      if (!route) return Term.print('cd: no such directory: ' + args[0], 'tl--err');
      if (route !== currentPath()) go(route);
    }
  });

  Term.register('open', {
    usage: 'open <name>', desc: 'open a project\'s live site',
    complete: function () { return PROJECTS.map(function (p) { return p.handle; }); },
    run: function (args) {
      var h = (args[0] || segments(Term.path)[1] || '').toLowerCase();
      var p = byHandle[h];
      if (!h) return Term.print('usage: open <name>', 'tl--err');
      if (!p) return Term.print('open: no such project: ' + args[0], 'tl--err');
      var url = safeUrl(p.live);
      if (!url) return Term.print('open: ' + p.handle + ' is not online yet', 'tl--err');
      Term.log('opening ' + Art.host(url));
      window.open(url, '_blank', 'noopener');
    }
  });

  /* ------------------------------------------------------------ chrome */

  var pill = document.querySelector('.sb-pill');
  function updatePill() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    pill.style.setProperty('--p', max > 0 ? Math.min(1, window.scrollY / max).toFixed(3) : 0);
  }
  window.addEventListener('scroll', updatePill, { passive: true });
  window.addEventListener('resize', updatePill);

  view.addEventListener('click', function (e) {
    var t = e.target.closest('[data-action]');
    if (!t) return;
    var a = t.dataset.action;
    if (a === 'scroll') document.getElementById('index').scrollIntoView({ behavior: 'smooth' });
    if (a === 'visit') Term.log('opening ' + Art.host(t.href));
    if (a === 'classified') {
      Term.log('request: /projects/' + t.dataset.idx);
      setTimeout(function () { Term.print('access denied: clearance required', 'tl--err'); }, 240);
    }
  });

  document.getElementById('to-top').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  var NODES = [
    ['lis-01', '38.72N 9.14W'], ['ams-02', '52.31N 4.76E'], ['fra-02', '50.11N 8.68E'],
    ['iad-03', '38.95N 77.45W'], ['nrt-02', '35.77N 140.39E'], ['syd-01', '33.94S 151.18E']
  ];
  var nodeIdx = 0;
  var globe = document.getElementById('globe');
  globe.addEventListener('click', function () {
    var n = NODES[nodeIdx++ % NODES.length];
    Term.log('geo: routing via ' + n[0] + ' [' + n[1] + '] rtt ' + (8 + Math.floor(Math.random() * 90)) + 'ms');
    globe.classList.add('is-fast');
    setTimeout(function () { globe.classList.remove('is-fast'); }, 900);
  });

  document.getElementById('menu-toggle').addEventListener('click', function () {
    var open = sidebar.classList.toggle('is-open');
    this.setAttribute('aria-expanded', String(open));
  });

  document.getElementById('logo').innerHTML = Art.logo();
  var gh = document.getElementById('gh');
  if (safeUrl(SITE.links.github)) gh.href = SITE.links.github; else gh.hidden = true;

  /* ------------------------------------------------------------- start */

  Term.init(document.getElementById('terminal'));
  window.addEventListener('hashchange', render);
  render();
  Term.boot().then(function () { booted = true; });
})();
