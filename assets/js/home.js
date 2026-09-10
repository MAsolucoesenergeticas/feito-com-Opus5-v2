document.addEventListener('DOMContentLoaded', () => {
  const MA = window.MA;
  if (!MA) return;

  const gal = document.getElementById('gal-home');
  if (gal && Array.isArray(MA.obras) && MA.obras.length) {
    gal.innerHTML = MA.obras.slice(0, 8).map((o, i) => `
      <figure>
        <a href="/obras">
          <img src="${o.src}" alt="${o.alt}" width="600" height="450" loading="lazy" decoding="async">
          <figcaption>Obra ${String(i + 1).padStart(2, '0')} · ${o.cidade || 'Oeste do PR'}</figcaption>
        </a>
      </figure>`).join('');
  }

  const lc = document.getElementById('lista-cidades');
  if (lc && Array.isArray(MA.cidades) && MA.cidades.length) {
    lc.innerHTML = MA.cidades.map(c => `<a class="chip" href="/energia-solar-${c.s}">📍 ${c.n}</a>`).join('');
  }
});
