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

  /* ===== Formulario -> WhatsApp ===== */
  var WPP = '5545991262160'; /* somente numeros, com 55 */

  var form = $('#form');
  if (!form) return;

  var okMsg = document.getElementById('formOk');

  var campos = [
    { id: 'nome',   label: 'Nome',                 req: true },
    { id: 'fone',   label: 'WhatsApp',             req: true },
    { id: 'email',  label: 'E-mail',               req: false, sempre: true },
    { id: 'perfil', label: 'Tipo de instalação',   req: true },
    { id: 'conta',  label: 'Conta de luz (média)', req: false },
    { id: 'msg',    label: 'Mensagem',             req: false }
  ];

  var setErro = function (el, texto) {
    var box = el.closest('.field');
    var out = box ? box.querySelector('.err') : null;
    if (out) out.textContent = texto || '';
    el.setAttribute('aria-invalid', texto ? 'true' : 'false');
    if (box) {
      box.classList.toggle('is-err', !!texto);
      box.classList.toggle('is-bad', !!texto);
    }
  };

  var valida = function () {
    var ok = true, primeiro = null;

    campos.forEach(function (c) {
      var el = document.getElementById(c.id);
      if (!el) return;
      var v = el.value.trim();
      var erro = '';

      if (c.req && !v) {
        erro = 'Campo obrigatório.';
      } else if (c.id === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
        erro = 'Informe um e-mail válido.';
      } else if (c.id === 'fone' && v && v.replace(/\D/g, '').length < 10) {
        erro = 'Informe o DDD e o número.';
      } else if (c.id === 'nome' && v && v.split(/\s+/).length < 2) {
        erro = 'Informe nome e sobrenome.';
      }

      setErro(el, erro);
      if (erro) { ok = false; if (!primeiro) primeiro = el; }
    });

    if (primeiro) primeiro.focus();
    return ok;
  };

  /* Remove caracteres que quebram a formatacao do WhatsApp */
  var limpa = function (s) {
    return String(s || '').replace(/[*_~`]/g, '').replace(/\s+/g, ' ').trim();
  };

  var montaMensagem = function () {
    var linhas = ['*Solicitação de orçamento*', ''];

    campos.forEach(function (c) {
      var el = document.getElementById(c.id);
      if (!el) return;
      var v = limpa(el.value);
      if (!v && !c.sempre) return;

      linhas.push('*' + c.label + ':*');
      linhas.push(v || 'vazio');
      linhas.push('');
    });

    linhas.push('*Origem:*');
    linhas.push('Site M&A Soluções Energéticas');

    return linhas.join('\n');
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!valida()) return;

    var url = 'https://wa.me/' + WPP + '?text=' + encodeURIComponent(montaMensagem());
    var aba = window.open(url, '_blank');
    if (!aba) window.location.href = url; /* fallback se o popup for bloqueado */

    if (okMsg) {
      okMsg.textContent = 'Abrimos o WhatsApp com seus dados. Toque em enviar para concluir.';
      okMsg.hidden = false;
    }
  });

  /* Limpa o erro ao corrigir */
  form.addEventListener('input', function (e) {
    if (e.target.matches('input, select, textarea')) setErro(e.target, '');
  });
})();
