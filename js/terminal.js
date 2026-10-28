/* Sidebar terminal: boot log, ambient system messages, and a real prompt.
   Anything typed that is not a known command (or a secret word from
   js/easter-eggs.js) answers with "unknown command: <input>". */
window.Terminal = (function () {
  var MAX_LINES = 400;
  var T = { commands: {}, history: [], path: '~', busy: true };
  var hIndex = -1, draft = '';

  function pad(v) { return String(v).padStart(2, '0'); }
  function clock(d) { d = d || new Date(); return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()); }
  function stamp(d) { return (d || new Date()).toLocaleString('en-GB'); }
  function rand(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function hex(len) { var s = ''; while (s.length < len) s += Math.floor(Math.random() * 16).toString(16); return s; }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function store(key, val) {
    try {
      if (val === undefined) return JSON.parse(localStorage.getItem(key));
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { return null; }
  }
  function session(key, val) {
    try {
      if (val === undefined) return sessionStorage.getItem(key);
      sessionStorage.setItem(key, val);
    } catch (e) { return null; }
  }

  /* ---------------------------------------------------------------- output */

  function append(node) {
    T.out.appendChild(node);
    while (T.out.childNodes.length > MAX_LINES) T.out.removeChild(T.out.firstChild);
    T.scroll.scrollTop = T.scroll.scrollHeight;
    return node;
  }

  T.print = function (text, cls) {
    var el = document.createElement('div');
    el.className = 'tl' + (cls ? ' ' + cls : '');
    el.textContent = text;
    return append(el);
  };

  T.printHTML = function (html, cls) {
    var el = document.createElement('div');
    el.className = 'tl' + (cls ? ' ' + cls : '');
    el.innerHTML = html;
    return append(el);
  };

  // timestamped line: [04:10:44] text
  T.log = function (text, cls) {
    return T.printHTML('<span class="tl__ts">[' + clock() + ']</span> ' + esc(text), cls);
  };

  T.clear = function () { T.out.innerHTML = ''; };

  T.setPath = function (p) {
    T.path = p;
    if (T.promptEl) T.promptEl.textContent = prompt();
  };

  function prompt() { return 'guest@pltr:' + T.path + '$'; }

  /* -------------------------------------------------------------- commands */

  T.register = function (name, def) { T.commands[name] = def; };

  T.run = function (raw) {
    var input = raw.trim();
    T.printHTML('<span class="tl__prompt">' + esc(prompt()) + '</span> ' + esc(raw), 'tl--cmd');
    if (!input) return;

    if (T.history[T.history.length - 1] !== input) T.history.push(input);
    if (T.history.length > 100) T.history.shift();
    store('pltr.history', T.history);

    var egg = matchEgg(input);
    if (egg) return unlock(egg);

    var parts = input.split(/\s+/);
    var cmd = T.commands[parts[0].toLowerCase()];
    if (cmd) return cmd.run(parts.slice(1), T);

    T.print('unknown command: ' + input, 'tl--err');
  };

  function matchEgg(input) {
    var eggs = window.EASTER_EGGS || [];
    if (!eggs.length || !window.PLTR_SECRET) return null;
    var h = window.PLTR_SECRET.hash(input);
    for (var i = 0; i < eggs.length; i++) if (String(eggs[i].hash).toLowerCase() === h) return eggs[i];
    return null;
  }

  function unlock(egg) {
    setBusy(true);
    T.log('signature match', 'tl--hi');
    return wait(380).then(function () {
      T.log('decrypting payload...');
      return wait(620);
    }).then(function () {
      T.log('access granted', 'tl--hi');
      return wait(520);
    }).then(function () {
      window.location.href = egg.page;
    });
  }

  function complete(value) {
    var parts = value.replace(/^\s+/, '').split(/\s+/);
    var pool, word;
    if (parts.length === 1) {
      pool = Object.keys(T.commands); word = parts[0];
    } else {
      var cmd = T.commands[parts[0].toLowerCase()];
      if (!cmd || !cmd.complete) return null;
      pool = cmd.complete(T); word = parts[parts.length - 1];
    }
    var hits = pool.filter(function (c) { return c.indexOf(word.toLowerCase()) === 0; });
    if (hits.length === 1) {
      parts[parts.length - 1] = hits[0];
      return parts.join(' ') + (parts.length === 1 ? ' ' : '');
    }
    if (hits.length > 1) {
      T.printHTML('<span class="tl__prompt">' + esc(prompt()) + '</span> ' + esc(value), 'tl--cmd');
      T.print(hits.join('  '), 'tl--dim');
    }
    return null;
  }

  // core commands; app.js adds ls / cd
  T.register('help', {
    usage: 'help', desc: 'list available commands',
    run: function () {
      T.print('available commands:');
      Object.keys(T.commands).sort().forEach(function (k) {
        var c = T.commands[k];
        T.print('  ' + (c.usage || k).padEnd(12) + c.desc, 'tl--dim');
      });
    }
  });
  T.register('clear', { usage: 'clear', desc: 'clear terminal output', run: function () { T.clear(); } });
  T.register('date', { usage: 'date', desc: 'print system time', run: function () { T.print(stamp()); } });
  T.register('whoami', { usage: 'whoami', desc: 'print current user', run: function () { T.print('guest (uid=1001, clearance=NONE)'); } });
  T.register('history', {
    usage: 'history', desc: 'show command history',
    run: function () {
      T.history.forEach(function (h, i) { T.print(String(i + 1).padStart(4) + '  ' + h, 'tl--dim'); });
    }
  });

  /* ------------------------------------------------------------------ input */

  function render() {
    var v = T.input.value, i = T.input.selectionStart == null ? v.length : T.input.selectionStart;
    T.pre.textContent = v.slice(0, i);
    T.cur.textContent = v.charAt(i) || ' ';
    T.post.textContent = v.slice(i + 1);
  }

  function setBusy(b) {
    T.busy = b;
    T.line.hidden = b;
    T.input.disabled = b;
    if (!b) render();
  }

  function onKey(e) {
    var inp = T.input;
    if (e.key === 'Enter') {
      e.preventDefault();
      var v = inp.value;
      inp.value = ''; hIndex = -1; draft = '';
      render();
      T.run(v);
      return;
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (!T.history.length) return;
      if (hIndex === -1) { draft = inp.value; }
      if (e.key === 'ArrowUp') hIndex = hIndex === -1 ? T.history.length - 1 : Math.max(0, hIndex - 1);
      else hIndex = hIndex === -1 ? -1 : hIndex + 1;
      if (hIndex >= T.history.length) hIndex = -1;
      inp.value = hIndex === -1 ? draft : T.history[hIndex];
      inp.setSelectionRange(inp.value.length, inp.value.length);
      render();
      return;
    }
    if (e.key === 'Tab' && inp.value.trim()) {
      e.preventDefault();
      var done = complete(inp.value);
      if (done) { inp.value = done; inp.setSelectionRange(done.length, done.length); render(); }
      return;
    }
    if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) { e.preventDefault(); T.clear(); return; }
    if (e.ctrlKey && (e.key === 'c' || e.key === 'C') && inp.selectionStart === inp.selectionEnd) {
      e.preventDefault();
      T.printHTML('<span class="tl__prompt">' + esc(prompt()) + '</span> ' + esc(inp.value) + '^C', 'tl--cmd');
      inp.value = ''; render();
      return;
    }
    if (e.key === 'Escape') { inp.blur(); return; }
    requestAnimationFrame(render);
  }

  T.focus = function () { if (!T.busy) T.input.focus({ preventScroll: true }); };

  /* ------------------------------------------------------------------- boot */

  function bootLines() {
    return [
      ['palantir-systems v4.2.1 (build ' + hex(5) + ')'],
      ['Initializing secure kernel...', 220],
      ['> Loading cryptographic modules... ok'],
      ['> Establishing encrypted channels... ok'],
      ['> Verifying authentication tokens... ok'],
      ['Mounting distributed filesystem...', 180],
      ['> /mnt/palantir-core: 47.3 TB available'],
      ['> /mnt/operations: 128.4 TB available'],
      ['Syncing network time protocol... ok', 160],
      ['System time: ' + stamp()],
      ['Starting background services...', 200],
      ['> watchdog_daemon [PID ' + rand(1200, 1999) + ']... running'],
      ['> secure_channel_mgr [PID ' + rand(2000, 2399) + ']... running'],
      ['> analytics_engine [PID ' + rand(2400, 2699) + ']... running'],
      ['> distributed_cache [PID ' + rand(2700, 2999) + ']... running'],
      ['Checking system integrity...', 240],
      ['> SHA-256 checksum: ' + hex(8) + '... verified'],
      ['> Digital signature: valid'],
      ['> Tamper detection: pass'],
      ['Establishing secure session...', 200],
      ['> Session ID: 0x' + hex(12)],
      ['> Encryption: AES-256-GCM'],
      ['> Perfect forward secrecy: enabled'],
      ['Loading user environment...', 160],
      ['> User preferences: loaded'],
      ['> Command history: restored'],
      ['System ready.', 120],
      ['Type "help" for available commands.']
    ];
  }

  T.boot = function () {
    var fast = session('pltr.booted') === '1';
    var lines = bootLines();
    setBusy(true);
    var chain = Promise.resolve();
    lines.forEach(function (l) {
      chain = chain.then(function () {
        T.print(l[0]);
        return fast ? null : wait((l[1] || 0) + rand(22, 60));
      });
    });
    return chain.then(function () {
      session('pltr.booted', '1');
      setBusy(false);
      ambient();
    });
  };

  function ambient() {
    var msgs = [
      function () { return '> network: latency ' + rand(8, 24) + 'ms'; },
      function () { return '> session: keepalive sent'; },
      function () { return '> monitor: system load ' + rand(18, 52) + '%'; },
      function () { return '> security: no threats detected'; },
      function () { return '> storage: garbage collection run'; },
      function () { return '> backup: snapshot created'; },
      function () { return '> cache: ' + rand(86, 99) + '% hit rate'; },
      function () { return '> sync: ntp drift ' + (Math.random() * 2).toFixed(2) + 'ms'; }
    ];
    (function tick() {
      setTimeout(function () {
        if (!document.hidden && !T.busy) T.print(msgs[rand(0, msgs.length - 1)](), 'tl--dim');
        tick();
      }, rand(7000, 16000));
    })();
  }

  /* ------------------------------------------------------------------- init */

  T.init = function (root) {
    T.root = root;
    T.scroll = root.querySelector('.term__scroll');
    T.out = root.querySelector('.term__out');
    T.line = root.querySelector('.term__line');
    T.promptEl = root.querySelector('.term__prompt');
    T.input = root.querySelector('.term__input');
    T.pre = root.querySelector('.term__pre');
    T.cur = root.querySelector('.term__cur');
    T.post = root.querySelector('.term__post');
    T.history = store('pltr.history') || [];
    T.setPath(T.path);

    T.input.addEventListener('keydown', onKey);
    T.input.addEventListener('input', render);
    T.input.addEventListener('focus', function () { root.classList.add('is-focused'); render(); });
    T.input.addEventListener('blur', function () { root.classList.remove('is-focused'); });

    // click anywhere in the terminal to type (unless selecting text to copy)
    root.addEventListener('mouseup', function () {
      var sel = window.getSelection && window.getSelection().toString();
      if (!sel) T.focus();
    });

    // start typing anywhere on the page -> goes to the terminal
    document.addEventListener('keydown', function (e) {
      if (T.busy || e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1 || !/[\p{L}\p{N}]/u.test(e.key)) return;
      var a = document.activeElement;
      if (a && (a === T.input || /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) || a.isContentEditable)) return;
      if (getComputedStyle(T.root).visibility === 'hidden' || !T.root.offsetParent) return;
      T.focus();
    });
  };

  return T;
})();
