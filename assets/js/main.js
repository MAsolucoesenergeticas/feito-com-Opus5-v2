(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* Ano do rodape */
  var ano = $('#ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* Header ao rolar */
  var hdr = $('#hdr');
  var onScroll = function () {
    if (hdr) hdr.classList.toggle('is-scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Menu mobile */
  var burger = $('#burger');
  var nav = $('#nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Simulador de economia */
  var simBtn = $('#simBtn');
  if (simBtn) {
    simBtn.addEventListener('click', function () {
      var v = parseFloat($('#sim').value);
      if (!v || v < 50) {
        alert('Informe um valor valido (minimo R$ 50).');
        return;
      }
      var total = v * 0.9 * 12 * 25;
      $('#simVal').textContent = total.toLocaleString('pt-BR', {
        style: 'currency', currency: 'BRL', maximumFractionDigits: 0
      });
      $('#simOut').hidden = false;
    });
  }

  /* Contadores */
  var stats = $$('.stats b[data-count]');
  var runCount = function (el) {
    var alvo = parseInt(el.getAttribute('data-count'), 10);
    var ini = null;
    var step = function (t) {
      if (!ini) ini = t;
      var p = Math.min((t - ini) / 1400, 1);
      el.textContent = Math.floor(p * alvo);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = alvo;
    };
    requestAnimationFrame(step);
  };

  /* Reveal + disparo dos contadores */
  var revTargets = $$('.card, .mini, .steps li, .pillars li, .sec__hd, .faq details');
  revTargets.forEach(function (el) { el.classList.add('rev'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revTargets.forEach(function (el) { io.observe(el); });

    var ioS = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        runCount(e.target);
        ioS.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    stats.forEach(function (el) { ioS.observe(el); });
  } else {
    revTargets.forEach(function (el) { el.classList.add('is-in'); });
    stats.forEach(runCount);
  }

  /* Mascara de telefone */
  var fone = $('#fone');
  if (fone) {
    fone.addEventListener('input', function () {
      var d = this.value.replace(/\D/g, '').slice(0, 11);
      var out = d;
      if (d.length > 2) out = '(' + d.slice(0, 2) + ') ' + d.slice(2);
      if (d.length > 7) {
        var corte = d.length > 10 ? 7 : 6;
        out = '(' + d.slice(0, 2) + ') ' + d.slice(2, corte) + '-' + d.slice(corte);
      }
      this.value = out;
    });
  }

  /* Mascara de moeda */
  var conta = $('#conta');
  if (conta) {
    conta.addEventListener('input', function () {
      var d = this.value.replace(/\D/g, '');
      if (!d) { this.value = ''; return; }
      this.value = (parseInt(d, 10) / 100).toLocaleString('pt-BR', {
        style: 'currency', currency: 'BRL'
      });
    });
  }

  /* Validacao do formulario */
  var form = $('#form');
  if (form) {
    var setErr = function (input, msg) {
      var field = input.closest('.field');
      var slot = $('.err', field);
      field.classList.toggle('is-bad', !!msg);
      if (slot) slot.textContent = msg || '';
      return !msg;
    };

    var validar = function (input) {
      var v = input.value.trim();
      if (!v) return setErr(input, 'Campo obrigatorio.');
      if (input.id === 'nome' && v.length < 3) return setErr(input, 'Informe o nome completo.');
      if (input.id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
        return setErr(input, 'E-mail invalido.');
      }
      if (input.id === 'fone' && v.replace(/\D/g, '').length < 10) {
        return setErr(input, 'Telefone incompleto.');
      }
      return setErr(input, '');
    };

    var obrigatorios = $$('[required]', form);
    obrigatorios.forEach(function (i) {
      i.addEventListener('blur', function () { validar(i); });
      i.addEventListener('input', function () {
        if (i.closest('.field').classList.contains('is-bad')) validar(i);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = obrigatorios.map(validar).every(Boolean);
      if (!ok) {
        var bad = $('.is-bad input, .is-bad select', form);
        if (bad) bad.focus();
        return;
      }
      var btn = $('button[type=submit]', form);
      btn.disabled = true;
      btn.textContent = 'Enviando...';

      setTimeout(function () {
        form.reset();
        btn.disabled = false;
        btn.textContent = 'Enviar solicitacao';
        $('#formOk').hidden = false;
        setTimeout(function () { $('#formOk').hidden = true; }, 6000);
      }, 900);
    });
  }
})();
