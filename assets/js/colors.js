/* Tema — precisa carregar no <head> para evitar flash */
(function () {
  const KEY = 'ma-theme';
  const root = document.documentElement;
  const saved = localStorage.getItem(KEY);
  const sys = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', saved || sys);

  window.MAtheme = {
    toggle() {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem(KEY, next);
      document.querySelectorAll('[data-theme-btn]').forEach(b => {
        b.textContent = next === 'dark' ? '☀️' : '🌙';
        b.setAttribute('aria-label', next === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
      });
    },
    init() {
      document.querySelectorAll('[data-theme-btn]').forEach(b => {
        b.textContent = root.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
        b.addEventListener('click', this.toggle);
      });
    }
  };
  document.addEventListener('DOMContentLoaded', () => window.MAtheme.init());
})();
