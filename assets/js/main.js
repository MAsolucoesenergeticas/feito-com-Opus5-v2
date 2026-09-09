document.addEventListener('DOMContentLoaded', () => {

  /* ---- Menu mobile ---- */
  const burger = document.querySelector('.burger');
  const links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
      burger.textContent = open ? '✕' : '☰';
    });
    links.addEventListener('click', e => {
      if (e.target.tagName === 'A') { links.classList.remove('open'); burger.textContent = '☰'; }
    });
  }

  /* ---- Injeta NAP / WhatsApp / ano a partir do content.js ---- */
  if (window.MA) {
    const cidade = document.body.dataset.cidade || '';
    document.querySelectorAll('[data-wa]').forEach(a => { a.href = MA.wa.link(cidade); });
    document.querySelectorAll('[data-tel]').forEach(a => {
      a.href = `tel:${MA.empresa.tel}`;
      if (!a.textContent.trim()) a.textContent = MA.empresa.telFmt;
    });
    document.querySelectorAll('[data-mail]').forEach(a => {
      a.href = `mailto:${MA.empresa.email}`;
      if (!a.textContent.trim()) a.textContent = MA.empresa.email;
    });
    document.querySelectorAll('[data-nap]').forEach(el => {
      const e = MA.empresa;
      el.textContent = `${e.rua} — ${e.cidade}/${e.uf} · CEP ${e.cep}`;
    });
    document.querySelectorAll('[data-ano]').forEach(el => { el.textContent = new Date().getFullYear(); });
  }

  /* ---- Reveal on scroll ---- */
  const io = new IntersectionObserver((es) => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -40px' });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));

  /* ---- Contadores ---- */
  document.querySelectorAll('[data-count]').forEach(el => {
    const alvo = parseFloat(el.dataset.count), suf = el.dataset.suf || '';
    new IntersectionObserver((e, o) => {
      if (!e[0].isIntersecting) return;
      o.disconnect();
      let i = 0; const passo = alvo / 45;
      const t = setInterval(() => {
        i += passo;
        if (i >= alvo) { i = alvo; clearInterval(t); }
        el.textContent = (alvo % 1 ? i.toFixed(1) : Math.floor(i).toLocaleString('pt-BR')) + suf;
      }, 22);
    }, { threshold: .5 }).observe(el);
  });

  /* ---- FAQ acordeão (1 aberto por vez) ---- */
  const faqs = document.querySelectorAll('.faq details');
  faqs.forEach(d => d.addEventListener('toggle', () => {
    if (d.open) faqs.forEach(o => { if (o !== d) o.open = false; });
  }));

  /* ---- Voltar ao topo ---- */
  const top = document.querySelector('.to-top');
  if (top) {
    addEventListener('scroll', () => top.classList.toggle('on', scrollY > 600), { passive: true });
    top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---- Marca link ativo no menu ---- */
  const atual = location.pathname.split('/').pop().replace('.html', '') || 'index';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const h = a.getAttribute('href').split('/').pop().replace('.html', '') || 'index';
    if (h === atual) a.setAttribute('aria-current', 'page');
  });
});
