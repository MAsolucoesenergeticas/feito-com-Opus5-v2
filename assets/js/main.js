/* ==========================================================================
   M&A SOLUÇÕES ENERGÉTICAS · main.js
   1. Tema claro/escuro     5. Contadores
   2. Menu mobile           6. Chat Magnum
   3. FAQ acordeão          7. Renderização (obras e cidades)
   4. Mapa lazy             8. Diversos
   ========================================================================== */
(function () {
  'use strict';

  const $  = (s, c) => (c || document).querySelector(s);
  const $$
= (s, c) => Array.prototype.slice.call((c || document).querySelectorAll(s)); const REDUCED = matchMedia('(prefers-reduced-motion:reduce)').matches; /* ================= 1. TEMA ================= */ (function theme() { const btn  = $('[data-theme-btn]'); const root = document.documentElement; const meta = $('meta[name="theme-color"]'); function apply(t, animate) { if (animate) { root.classList.add('theme-anim'); setTimeout(() => root.classList.remove('theme-anim'), 400); } root.setAttribute('data-theme', t); if (meta) meta.setAttribute('content', t === 'dark' ? '#0A1420' : '#08203A'); if (btn) btn.setAttribute('aria-label', t === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'); try { localStorage.setItem('ma-theme', t); } catch (e) {} } apply(root.getAttribute('data-theme') || 'light', false); if (btn) btn.addEventListener('click', function () { apply(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', !REDUCED); }); // segue o SO apenas se o usuário nunca escolheu manualmente let saved = null; try { saved = localStorage.getItem('ma-theme'); } catch (e) {} if (!saved) { matchMedia('(prefers-color-scheme:dark)').addEventListener('change', e => { apply(e.matches ? 'dark' : 'light', true); try { localStorage.removeItem('ma-theme'); } catch (err) {} }); } })(); /* ================= 2. MENU MOBILE ================= */ (function nav() { const burger  = $('.burger'); const menu    = $('#menu') || $('.menu'); const overlay = $('.overlay'); if (!burger || !menu) return; const parent = menu.parentNode; const anchor = document.createComment('menu-slot'); parent.insertBefore(anchor, menu); let moved = false; const isMobile = () => matchMedia('(max-width:980px)').matches; // no mobile o menu vira filho do <body> para escapar de qualquer // contexto de empilhamento criado pelo header function reparent() { if (isMobile() && !moved)      { document.body.appendChild(menu); moved = true; } else if (!isMobile() && moved) { parent.insertBefore(menu, anchor); moved = false; close(); } } function open() { menu.classList.add('is-open'); if (overlay) { overlay.hidden = false; requestAnimationFrame(() => overlay.classList.add('is-on')); } burger.classList.add('is-x'); burger.setAttribute('aria-expanded', 'true'); burger.setAttribute('aria-label', 'Fechar menu'); document.documentElement.classList.add('nav-lock'); document.body.classList.add('nav-open'); } function close() { menu.classList.remove('is-open'); if (overlay) { overlay.classList.remove('is-on'); setTimeout(() => { if (!overlay.classList.contains('is-on')) overlay.hidden = true; }, 300); } burger.classList.remove('is-x'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Abrir menu'); document.documentElement.classList.remove('nav-lock'); document.body.classList.remove('nav-open'); } const isOpen = () => menu.classList.contains('is-open'); burger.addEventListener('click', () => (isOpen() ? close() : open())); if (overlay) overlay.addEventListener('click', close); menu.addEventListener('click', e => { if (e.target.closest('a')) close(); }); document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen()) { close(); burger.focus(); } }); let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(reparent, 150); }); reparent(); })(); /* ================= 3. FAQ ================= */ (function faq() {
$$('.faq-q').forEach(function (q) {
      const a = document.getElementById(q.getAttribute('aria-controls'));
      if (!a) return;
      q.addEventListener('click', function () {
        const open = q.getAttribute('aria-expanded') === 'true';

        // acordeão: fecha os demais
        $$
('.faq-q').forEach(function (o) { if (o === q) return; const oa = document.getElementById(o.getAttribute('aria-controls')); o.setAttribute('aria-expanded', 'false'); o.classList.remove('is-open'); if (oa) oa.classList.remove('is-open'); }); q.setAttribute('aria-expanded', String(!open)); q.classList.toggle('is-open', !open); a.classList.toggle('is-open', !open); }); }); })(); /* ================= 4. MAPA LAZY ================= */ (function map() { const box = $('.map-frame.map-lazy'); if (!box) return; function load() { const src = box.getAttribute('data-src'); if (!src) return; const f = document.createElement('iframe'); f.src = src; f.title = 'Área de atendimento da M&A Soluções Energéticas'; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade'; f.setAttribute('allowfullscreen', ''); box.innerHTML = ''; box.appendChild(f); box.classList.remove('map-lazy'); box.removeAttribute('role'); box.removeAttribute('tabindex'); box.removeAttribute('data-src'); } box.addEventListener('click', load); box.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); load(); } }); })(); /* ================= 5. CONTADORES ================= */ (function counters() { const els =
$$('[data-count]');
    if (!els.length) return;

    const fmt = (n, dec) =>
      n.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });

    function run(el) {
      const end = parseFloat(el.getAttribute('data-count'));
      const suf = el.getAttribute('data-suf') || '';
      const dec = (String(end).split('.')[1] || '').length;
      if (isNaN(end) || REDUCED) { el.textContent = fmt(end || 0, dec) + suf; return; }

      const dur = 1400;
      let t0 = null;
      (function step(ts) {
        if (!t0) t0 = ts;
        const p = Math.min((ts - t0) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(end * e, dec) + suf;
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    }

    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    const io = new IntersectionObserver(function (list) {
      list.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    els.forEach(el => io.observe(el));
  })();

  /* ================= 6. CHAT MAGNUM ================= */
  (function chat() {
    const box = $('#chat-magnum');
    if (!box) return;

    const typing = $('.chat-typing', box);
    const msgs   = $$
('.chat-msg', box); const cta    = $('.chat-body .btn-wa', box); const times  =
$$('[data-chat-time]', box);
    const hhmm   = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    times.forEach(s => (s.textContent = hhmm));

    let played = false;
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    async function play() {
      if (played) return;
      played = true;
      for (let i = 0; i < msgs.length; i++) {
        if (typing) typing.classList.add('is-on');
        await sleep(REDUCED ? 120 : 900 + i * 350);
        if (typing) typing.classList.remove('is-on');
        msgs[i].classList.add('show');
        await sleep(REDUCED ? 60 : 250);
      }
      if (cta) cta.classList.add('show');
    }

    function show() { box.classList.remove('is-min'); box.classList.add('is-on'); play(); }
    function mini() { box.classList.add('is-min'); box.classList.add('is-on'); }

    $$
('[data-chat-open]', box).forEach(b => b.addEventListener('click', show));
$$('[data-chat-min]',  box).forEach(b => b.addEventListener('click', mini));

    // primeira visita: abre aberto. Retorno: abre minimizado.
    let seen = false;
    try { seen = sessionStorage.getItem('ma-chat') === '1'; } catch (e) {}
    setTimeout(function () {
      if (seen) mini(); else { show(); try { sessionStorage.setItem('ma-chat', '1'); } catch (e) {} }
    }, seen ? 1200 : 3200);
  })();

  /*
