/* Carrega o iframe do Google Maps só no clique/scroll → zero custo no PageSpeed */
(function () {
  function embed(box) {
    const q = box.dataset.q || `${MA.empresa.nome}, ${MA.empresa.cidade} - ${MA.empresa.uf}`;
    const z = box.dataset.zoom || 13;
    const f = document.createElement('iframe');
    f.src = `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=${z}&output=embed`;
    f.loading = 'lazy';
    f.title = `Mapa — ${q}`;
    f.referrerPolicy = 'no-referrer-when-downgrade';
    f.allowFullscreen = true;
    box.innerHTML = '';
    box.appendChild(f);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.map-box').forEach(box => {
      const ph = document.createElement('div');
      ph.className = 'map-ph';
      ph.innerHTML = `<span style="font-size:2.2rem">📍</span>
        <strong>${box.dataset.label || 'Ver no mapa'}</strong>
        <small style="color:var(--ink-3)">Clique para carregar o Google Maps</small>`;
      ph.addEventListener('click', () => embed(box), { once: true });
      box.appendChild(ph);

      /* Carrega automaticamente se o usuário chegar perto */
      new IntersectionObserver((e, o) => {
        if (e[0].isIntersecting) { embed(box); o.disconnect(); }
      }, { rootMargin: '400px' }).observe(box);
    });
  });
})();
