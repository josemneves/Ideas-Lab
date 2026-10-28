/* Router + views. Hash routes (#/projects/peptide-atlas) so the site works
   straight from the file system and on any static host (GitHub Pages, Vercel). */
(function () {
  var SITE = window.SITE, PROJECTS = window.PROJECTS, Art = window.Art, Term = window.Terminal;
  var view = document.getElementById('view');
  var sidebar = document.getElementById('sidebar');

  var byHandle = {};
  PROJECTS.forEach(function (p, i) { p.index = i; byHandle[p.handle] = p; });

  var STATUS = { live: 'Live', building: 'Building', prototype: 'Prototype', paused: 'Paused' };
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var BGS = ['mid', 'light', 'dark'];

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function safeUrl(u) { return /^(https?:|mailto:)/i.test(u || '') ? u : ''; }
  function num(i) { return String(i + 1).padStart(2, '0'); }
  function code(i, p) { return 'IDEA-' + num(i) + (p && p.date ? '-' + p.date.slice(0, 7).replace('-', '') : ''); }
  function month(d) { var m = /^(\d{4})-(\d{2})/.exec(d || ''); return m ? MONTHS[+m[2] - 1] + ' ' + m[1] : '—'; }
  function status(p) { return STATUS[p.status] || p.status || ''; }
  function lines(name) { return esc(name).split(' ').join('<br>'); }
  function featured() { return byHandle[SITE.featured] || PROJECTS[PROJECTS.length - 1]; }

  var ARROW_DOWN = '<svg width="12" height="16" viewBox="0 0 12 16" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M6 1v13.5M1 9.5l5 5 5-5"/></svg>';

  /* ---------------------------------------------------------------- tiles */

  function tile(p) {
    return '<a class="tile tile--' + BGS[p.index % BGS.length] + '" href="#/projects/' + p.handle + '" title="' + esc(p.name) + '">' +
      '<div class="tile__art">' + Art.shot(p) + '</div>' +
      '<div class="tile__label"><span>' + num(p.index) + ' — ' + esc(p.name) + '</span><span>' + status(p) + ' · ' + month(p.date) + '</span></div>' +
      '<div class="tile__cta">View project<span class="arr">→</span></div></a>';
  }

  function classifiedTile(i) {
    return '<button class="tile tile--dark tile--classified" data-action="classified" data-idx="' + num(i) + '" title="Classified">' +
      '<div class="tile__art">' + Art.classified(i + 3) + '</div>' +
      '<div class="tile__label"><span>' + num(i) + ' — Classified</span><span>Clearance required</span></div></button>';
  }

  // projects first, then "classified" slots until the last row is full (min. `min` tiles)
  function grid(list, min) {
    var html = list.map(tile).join('');
    var total = Math.max(min || 0, Math.ceil(list.length / 3) * 3);
    for (var k = list.length, next = PROJECTS.length; k < total; k++) html += classifiedTile(next++);
    return '<section class="grid" id="index">' + html + '</section>';
  }

  function footer() {
    return '<footer class="foot"><span>© 2026 ' + esc(SITE.name) + '</span>' +
      '<span>Design inspired by store.palantir.com — not affiliated with Palantir Technologies Inc.</span></footer>';
  }

  /* ---------------------------------------------------------------- views */

  function viewLanding() {
    var f = featured();
    return '<section class="hero">' +
      '<div class="hero__media">' + Art.picture(f, '', false) + '</div>' +
      '<div class="hero__veil"></div>' +
      '<div class="hero__tag mono"><span>' + esc(SITE.name) + ' — ' + esc(SITE.tagline) + '</span><span>' + num(PROJECTS.length - 1) + ' projects</span></div>' +
      '<div class="hero__type">' +
        '<span class="hero__season">S. 2026</span>' +
        '<span class="hero__kicker mono">Latest — ' + num(f.index) + ' · ' + status(f) + '</span>' +
        '<h1 class="hero__title">' + lines(f.name) + '</h1>' +
      '</div>' +
      '<div class="hero__side">' +
        '<p class="hero__pitch">' + esc(f.pitch) + '</p>' +
        '<div class="hero__actions">' +
          '<a class="hero__shop" href="#/projects/' + f.handle + '">View project →</a>' +
          '<button class="hero__shop" data-action="scroll">All projects ' + ARROW_DOWN + '</button>' +
        '</div>' +
      '</div>' +
      '</section>' + grid(PROJECTS, 3) + footer();
  }

  function viewProject(p) {
    var live = safeUrl(p.live), repo = safeUrl(p.repo);
    var others = PROJECTS.filter(function (x) { return x !== p; });
    var specs = [
      ['Status', status(p)],
      ['Started', month(p.date)],
      ['Tags', (p.tags || []).join(' · ') || '—'],
      ['URL', live ? Art.host(live) : 'Not online yet']
    ].map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('');
    var full = Art.picture(p, '');

    return '<article class="pdp">' +
      '<div class="pdp__media">' +
        '<div class="pdp__img tile--' + BGS[p.index % BGS.length] + '">' + Art.shot(p) + '</div>' +
        (full ? '<div class="pdp__img pdp__img--full">' + full + '</div>' : '') +
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
      grid(others, 3) + footer();
  }

  function viewAbout() {
    var L = SITE.links;
    var links = [['X', L.x], ['GitHub', L.github], ['LinkedIn', L.linkedin], ['Email', L.email]]
      .filter(function (r) { return safeUrl(r[1]); })
      .map(function (r) {
        var label = r[1].replace(/^mailto:/, '').replace(/^https?:\/\/(www\.)?/, '');
        return '<div><dt>' + r[0] + '</dt><dd><a href="' + esc(r[1]) + '" target="_blank" rel="noopener">' + esc(label) + ' ↗</a></dd></div>';
      }).join('');

    var building = PROJECTS.filter(function (p) { return p.status === 'building' || p.status === 'prototype'; });
    var shipped = PROJECTS.filter(function (p) { return p.status === 'live'; });
    var now = building.map(function (p) {
      return '<li><span class="mono status status--' + esc(p.status) + '">' + status(p) + '</span>' +
        '<a href="#/projects/' + p.handle + '">' + esc(p.name) + '</a><span>' + esc(p.pitch) + '</span></li>';
    }).join('') + (shipped.length
      ? '<li><span class="mono status status--live">Latest live</span><a href="#/projects/' + shipped[shipped.length - 1].handle + '">' +
        esc(shipped[shipped.length - 1].name) + '</a><span>' + esc(shipped[shipped.length - 1].pitch) + '</span></li>'
      : '');

    var principles = (SITE.principles || []).map(function (r, i) {
      return '<li><span class="mono">' + num(i) + '</span><div><b>' + esc(r[0]) + '</b><span>' + esc(r[1]) + '</span></div></li>';
    }).join('');

    var index = PROJECTS.map(function (p) {
      return '<a class="irow" href="#/projects/' + p.handle + '">' +
        '<span class="mono irow__num">' + num(p.index) + '</span>' +
        '<span class="irow__name">' + esc(p.name) + '</span>' +
        '<span class="irow__pitch">' + esc(p.pitch) + '</span>' +
        '<span class="mono status status--' + esc(p.status) + '">' + status(p) + '</span>' +
        '<span class="mono irow__date">' + month(p.date) + '</span>' +
        '<span class="irow__arr">→</span></a>';
    }).join('');

    return '<section class="about">' +
      '<header class="about__head"><h1>About</h1><span class="mono">' + num(PROJECTS.length - 1) + ' projects · since ' + month(PROJECTS[0].date) + '</span></header>' +
      '<div class="about__hero">' +
        '<p class="about__name">' + lines(SITE.name) + '</p>' +
        '<p class="about__intro">' + esc(SITE.intro) + '</p>' +
      '</div>' +
      '<div class="about__cols">' +
        '<div class="about__col"><span class="pdp__label mono">Now</span><ul class="about__now">' + now + '</ul></div>' +
        '<div class="about__col"><span class="pdp__label mono">How I build</span><ol class="about__principles">' + principles + '</ol></div>' +
        '<div class="about__col"><span class="pdp__label mono">Elsewhere</span><dl class="specs">' + links + '</dl></div>' +
      '</div>' +
      '<div class="section-head mono"><span>Index</span><span>' + PROJECTS.length + ' total</span></div>' +
      '<div class="about__index">' + index + '</div>' +
      '<p class="about__hint mono">Some pages are not linked from anywhere. The terminal knows the way.</p>' +
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
      return { html: function () { return viewProject(p); }, nav: 'projects', term: '~/projects/' + p.handle, title: p.name };
    }
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

  function go(path) { if (path !== currentPath()) location.hash = '#' + path; }

  /* ------------------------------------------------ terminal: ls / cd / open */

  function segments(termPath) { return termPath.replace(/^~\/?/, '').split('/').filter(Boolean); }
  function squash(s) { return String(s).toLowerCase().replace(/[^a-z0-9]/g, ''); }

  // "recovery-lens", "Recovery Lens", "recoverylens", "1", "01" -> project
  function findProject(q) {
    var k = squash(q);
    if (!k) return null;
    if (/^\d+$/.test(k)) return PROJECTS[+k - 1] || null;
    for (var i = 0; i < PROJECTS.length; i++) {
      if (squash(PROJECTS[i].handle) === k || squash(PROJECTS[i].name) === k) return PROJECTS[i];
    }
    return null;
  }

  function children(parts) {
    if (!parts.length) return ['projects', 'about'];
    if (parts.length === 1 && parts[0] === 'projects') return PROJECTS.map(function (p) { return p.handle; });
    return null;
  }

  // "..", "~/projects/recovery-lens", "about"... -> route (relative paths fall back to ~)
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
    if (parts.length === 1 && /^(projects|about)$/.test(parts[0])) return '/' + parts[0];
    var h = parts[parts.length - 1];
    if (byHandle[h] && (parts.length === 1 || (parts.length === 2 && parts[0] === 'projects'))) return '/projects/' + h;
    return null;
  }

  function listProjects() {
    PROJECTS.forEach(function (p) {
      var where = safeUrl(p.live) ? Art.host(p.live) : 'not online yet';
      Term.print('  ' + num(p.index) + '  ' + p.handle.padEnd(16) + status(p).toLowerCase().padEnd(10) + where, 'tl--dim');
    });
  }

  Term.helpFooter = function () {
    Term.print('projects: ' + PROJECTS.map(function (p) { return p.handle; }).join(', '), 'tl--dim');
    Term.print('tip: Tab completes a command, ↑ ↓ repeat earlier ones', 'tl--dim');
  };

  Term.register('ls', {
    usage: 'ls', desc: 'list the sections, or the projects inside projects/',
    details: ['ls             what is in the current folder', 'ls projects    every project, with its number'],
    run: function (args) {
      var termPath = Term.path;
      if (args.length) {
        var route = routeFor(args.join(' '));
        if (!route) return Term.print('ls: no such section: ' + args.join(' ') + '  (try: ls projects)', 'tl--err');
        termPath = resolve(route).term;
      }
      var parts = segments(termPath), list = children(parts);
      if (!list) {
        var p = byHandle[parts[parts.length - 1]];
        return Term.print(p ? p.name + ' — ' + status(p) + '. Type "open" to visit it.' : '(empty)', 'tl--dim');
      }
      if (!parts.length) return Term.print('projects/  about');
      listProjects();
    }
  });

  Term.register('cd', {
    usage: 'cd <place>', desc: 'go to a page: a section or a project',
    details: ['cd projects       the project index', 'cd about          the about page',
      'cd recovery-lens  a project page (names and numbers work too: cd 2)', 'cd ..             one level up        cd ~   home'],
    complete: function () { return ['projects', 'about', '..'].concat(PROJECTS.map(function (p) { return p.handle; })); },
    run: function (args) {
      var q = args.join(' ');
      var route = routeFor(q || '~');
      var p = !route && findProject(q);
      if (p) route = '/projects/' + p.handle;
      if (!route) return Term.print('cd: no such page: ' + q + '  (try: cd projects, cd about)', 'tl--err');
      go(route);
    }
  });

  Term.register('open', {
    usage: 'open <project>', desc: 'open a project\'s live website in a new tab',
    details: ['open recovery-lens   by name (spaces and capitals are fine)', 'open 1               by number',
      'open                 inside a project page: opens that project', 'open projects        list what can be opened'],
    complete: function () { return PROJECTS.map(function (p) { return p.handle; }).concat(['projects']); },
    run: function (args) {
      var q = args.join(' ');
      var here = segments(Term.path)[1];
      if (!q && here) q = here;
      if (!q || /^(projects|list)$/i.test(q)) {
        Term.print('openable projects:');
        listProjects();
        Term.print('usage: open <name or number>, e.g. open ' + PROJECTS[0].handle, 'tl--dim');
        if (/^projects$/i.test(q)) go('/projects');
        return;
      }
      if (/^about$/i.test(q)) return go('/about');
      var p = findProject(q);
      if (!p) return Term.print('open: no project called "' + q + '". Type "open" to see the list.', 'tl--err');
      var url = safeUrl(p.live);
      if (!url) {
        Term.print(p.name + ' is not online yet. Showing its page instead.', 'tl--err');
        return go('/projects/' + p.handle);
      }
      // a real link too, in case the browser blocks the new tab
      Term.printHTML('<span class="tl__ts">[' + new Date().toTimeString().slice(0, 8) + ']</span> opening ' +
        '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(Art.host(url)) + ' ↗</a>');
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
