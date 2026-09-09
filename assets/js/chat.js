/* Magnum - Assistente virtual M&A Solucoes Energeticas */
(function () {
  'use strict';

  var CFG = {
    nome: 'Magnum',
    wpp: '5545999999999',
    /* Deixe endpoint vazio para operar 100% local.
       Preencha com sua URL de backend para usar LLM. */
    endpoint: '',
    delayMin: 500,
    delayMax: 1100
  };

  /* ---------- Base de conhecimento ---------- */
  var KB = [
    {
      tags: ['preco', 'preço', 'valor', 'custo', 'quanto custa', 'quanto fica', 'orcamento', 'orçamento', 'investimento'],
      r: 'O investimento depende do consumo e do tipo de telhado. Como referência em Cascavel:<ul>' +
         '<li><b>Residencial</b> (conta ~R$ 500): a partir de R$ 18 mil</li>' +
         '<li><b>Comercial</b> (conta ~R$ 2 mil): a partir de R$ 62 mil</li>' +
         '<li><b>Rural</b>: projeto dimensionado por demanda</li></ul>' +
         'Me diga o valor médio da sua conta de luz que eu estimo a economia.'
    },
    {
      tags: ['economia', 'economizar', 'reduz', 'desconto', 'quanto poupo', 'diminuir conta'],
      r: 'A redução fica entre <b>75% e 80%</b> da fatura. Permanece apenas a taxa mínima de disponibilidade da Copel (30 kWh monofásico, 50 kWh bifásico, 100 kWh trifásico). Qual o valor da sua conta hoje?'
    },
    {
      tags: ['retorno', 'payback', 'se paga', 'vale a pena', 'quanto tempo pra pagar'],
      r: 'O <b>payback</b> médio dos nossos projetos é de <b>3 a 5 anos</b>. Como o sistema gera por 25 anos, você tem cerca de duas décadas de energia praticamente gratuita — retorno superior à maioria das aplicações de renda fixa.'
    },
    {
      tags: ['financiamento', 'financiar', 'parcela', 'parcelar', 'credito', 'crédito', 'banco', 'pronaf', 'entrada'],
      r: 'Trabalhamos com linhas de crédito para os três perfis:<ul>' +
         '<li><b>Pessoa física</b>: até 72 meses, carência de 6 meses</li>' +
         '<li><b>Empresas</b>: BNDES e bancos parceiros</li>' +
         '<li><b>Rural</b>: Pronaf Eco e Inovagro, com juros reduzidos</li></ul>' +
         'Em muitos casos a parcela fica próxima do valor que você já paga de luz.'
    },
    {
      tags: ['prazo', 'demora', 'quanto tempo', 'instalacao dura', 'entrega'],
      r: 'Cronograma típico:<ul><li>Proposta técnica: até 2 dias úteis</li>' +
         '<li>Homologação na Copel: 15 a 30 dias</li>' +
         '<li>Instalação: 1 a 5 dias úteis</li>' +
         '<li>Vistoria e troca do medidor: até 7 dias</li></ul>Total médio: <b>30 a 45 dias</b>.'
    },
    {
      tags: ['garantia', 'durabilidade', 'vida util', 'vida útil', 'dura quantos anos'],
      r: 'Garantias de fábrica:<ul><li><b>Módulos</b>: 12 anos contra defeito e 25 anos de performance</li>' +
         '<li><b>Inversor</b>: 5 a 12 anos, extensível</li>' +
         '<li><b>Estrutura</b>: 10 anos contra corrosão</li>' +
         '<li><b>Instalação M&A</b>: 2 anos</li></ul>'
    },
    {
      tags: ['manutencao', 'manutenção', 'limpeza', 'limpar', 'cuidado'],
      r: 'Manutenção é mínima: <b>limpeza dos módulos 1 a 2 vezes por ano</b> com água e escova macia. Não há partes móveis. O monitoramento pelo app avisa qualquer queda de geração.'
    },
    {
      tags: ['noite', 'nublado', 'chuva', 'chove', 'sem sol', 'inverno', 'falta luz', 'apagao', 'apagão'],
      r: 'À noite e em dias nublados você consome da rede usando os <b>créditos</b> gerados no excedente — o sistema é on-grid. Em dias nublados a geração cai, mas não para. O dimensionamento já usa a média anual de irradiação do Oeste do PR.'
    },
    {
      tags: ['bateria', 'baterias', 'off grid', 'offgrid', 'armazenar'],
      r: 'O padrão é <b>on-grid</b> (sem bateria), que tem o melhor custo-benefício. Baterias fazem sentido em áreas com quedas frequentes de energia ou locais sem rede. Posso incluir essa opção no orçamento se você quiser comparar.'
    },
    {
      tags: ['telhado', 'espaco', 'espaço', 'area', 'área', 'cabe', 'metros', 'solo', 'laje'],
      r: 'Cada <b>1 kWp</b> ocupa cerca de <b>5 m²</b>. Um sistema residencial de 6 kWp precisa de ~30 m². Instalamos em telha cerâmica, metálica, fibrocimento, laje e estrutura de solo.'
    },
    {
      tags: ['atende', 'regiao', 'região', 'cidade', 'cascavel', 'onde ficam', 'endereco', 'endereço', 'localizacao'],
      r: 'Somos de <b>Cascavel - PR</b> e atendemos toda a região Oeste: Toledo, Foz do Iguaçu, Marechal Cândido Rondon, Medianeira, Assis Chateaubriand, Corbélia e cidades vizinhas.'
    },
    {
      tags: ['contato', 'telefone', 'whatsapp', 'email', 'e-mail', 'falar com', 'humano', 'atendente', 'vendedor'],
      r: 'Claro. Você pode falar com nosso time agora:<ul>' +
         '<li><b>WhatsApp</b>: <a href="https://wa.me/' + CFG.wpp + '" target="_blank" rel="noopener">(45) 99999-9999</a></li>' +
         '<li><b>E-mail</b>: contato@masolucoesenergeticas.com.br</li>' +
         '<li><b>Horário</b>: seg a sex, 8h às 18h</li></ul>' +
         'Ou preencha o <a href="#contato">formulário de orçamento</a>.'
    },
    {
      tags: ['horario', 'horário', 'funciona que horas', 'aberto'],
      r: 'Nosso atendimento é de <b>segunda a sexta, 8h às 18h</b>. Eu fico disponível 24 horas para dúvidas técnicas.'
    },
    {
      tags: ['documento', 'documentos', 'documentacao', 'papel', 'preciso levar'],
      r: 'Para a homologação precisamos de: <b>fatura de energia recente</b>, <b>documento do titular</b> (RG/CPF ou CNPJ) e <b>comprovante de endereço</b>. Toda a burocracia com a Copel é feita por nós.'
    },
    {
      tags: ['imposto', 'lei 14300', 'taxacao', 'taxação', 'regra nova', 'mudou a lei'],
      r: 'A <b>Lei 14.300/2022</b> instituiu cobrança gradual sobre a energia injetada (Fio B), mas quem instala agora mantém o modelo vigente até 2045. A economia continua alta — e antecipar a instalação garante regra melhor.'
    },
    {
      tags: ['equipamento', 'marca', 'painel', 'placa', 'inversor', 'modulo', 'módulo', 'fabricante'],
      r: 'Usamos apenas <b>equipamentos Tier 1</b> homologados no INMETRO: módulos de 550 a 620 Wp e inversores com monitoramento Wi-Fi. Especificamos o modelo exato na proposta, sem trocas sem aviso.'
    },
    {
      tags: ['obrigado', 'obrigada', 'valeu', 'legal', 'otimo', 'ótimo', 'perfeito'],
      r: 'Disponha! Se quiser, posso registrar seu contato para um especialista enviar a proposta técnica. 🙂'
    },
    {
      tags: ['oi', 'ola', 'olá', 'bom dia', 'boa tarde', 'boa noite', 'eai', 'e ai', 'tudo bem'],
      r: 'Olá! Tudo bem? Sou o <b>Magnum</b>, assistente da M&A. Posso falar sobre custos, economia, financiamento e prazos. O que você quer saber?'
    }
  ];

  var FALLBACK = 'Não tenho essa informação com precisão para não te passar dado errado. ' +
    'Posso ajudar com <b>preços</b>, <b>economia</b>, <b>financiamento</b>, <b>prazos</b>, <b>garantias</b> e <b>manutenção</b>. ' +
    'Para casos específicos, fale direto com nosso time no <a href="https://wa.me/' + CFG.wpp + '" target="_blank" rel="noopener">WhatsApp</a>.';

  /* ---------- Motor de intencao ---------- */
  var norm = function (s) {
    return s.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ').trim();
  };

  var responder = function (txt) {
    var q = norm(txt);

    /* Se houver numero grande, trata como valor de conta */
    var num = q.match(/\b(\d{3,6})\b/);
    if (num && /(conta|luz|pago|fatura|reais|r|energia|mes|média|media)/.test(q)) {
      var v = parseInt(num[1], 10);
      if (v >= 100 && v <= 100000) {
        var eco = v * 0.9 * 12 * 25;
        var kwp = Math.max(2, Math.round((v / 0.95 / 130) * 10) / 10);
        return 'Com uma conta de <b>R$ ' + v.toLocaleString('pt-BR') + '</b>:<ul>' +
          '<li>Sistema estimado: <b>~' + kwp.toLocaleString('pt-BR') + ' kWp</b></li>' +
          '<li>Economia em 25 anos: <b>' + eco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }) + '</b></li>' +
          '<li>Área necessária: <b>~' + Math.round(kwp * 5) + ' m²</b></li></ul>' +
          'Estimativa referencial. Quer que eu registre seu contato para o cálculo exato?';
      }
    }

    var best = null, bestScore = 0;
    KB.forEach(function (item) {
      var score = 0;
      item.tags.forEach(function (tag) {
        var t = norm(tag);
        if (q === t) score += 6;
        else if (q.indexOf(t) !== -1) score += t.indexOf(' ') !== -1 ? 4 : 2;
      });
      if (score > bestScore) { bestScore = score; best = item; }
    });

    return bestScore >= 2 ? best.r : FALLBACK;
  };

  /* ---------- UI ---------- */
  var CHIPS = ['Quanto custa?', 'Quanto vou economizar?', 'Tem financiamento?', 'Qual o prazo?', 'Falar com atendente'];

  var svgSend = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>';
  var svgWpp = '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5 0-1.1 0-2.4-.6a11 11 0 0 1-4.6-4.2c-.6-1-.9-1.9-.9-2.6 0-.8.4-1.5.8-1.9.3-.3.6-.3.8-.3h.5c.2 0 .4 0 .6.5l.7 1.7c0 .2 0 .4-.1.5l-.4.5c-.1.2-.2.3 0 .6a8 8 0 0 0 3.4 2.9c.3.1.4.1.6-.1l.7-.8c.2-.2.4-.1.6 0l1.6.8c.3.2.4.3.4.5s0 .8-.2 1.2z"/></svg>';
  var svgChat = '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M12 3C7 3 3 6.6 3 11c0 2.3 1.1 4.4 2.9 5.8L5 21l4.3-1.7c.9.2 1.8.3 2.7.3 5 0 9-3.6 9-8s-4-8.6-9-8.6zM8 12.2a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4zm4 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4zm4 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4z"/></svg>';

  var html =
    '<div class="mg-fab">' +
      '<button class="mg-btn mg-btn--mg" id="mgOpen" aria-label="Abrir chat com Magnum">' + svgChat + '</button>' +
      '<a class="mg-btn mg-btn--wpp" href="https://wa.me/' + CFG.wpp + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + svgWpp + '</a>' +
    '</div>' +
    '<div class="mg-tip" id="mgTip">' +
      '<button class="mg-tip__x" id="mgTipX" aria-label="Fechar">×</button>' +
      'Oi! Sou o <b>Magnum</b>. Quer saber quanto você pode economizar?' +
    '</div>' +
    '<div class="mg" id="mgWin" role="dialog" aria-label="Chat com Magnum" aria-modal="false">' +
      '<div class="mg__hd">' +
        '<div class="mg__av">M</div>' +
        '<div class="mg__id"><b>Magnum</b><span>Assistente M&amp;A · online</span></div>' +
        '<button class="mg__x" id="mgClose" aria-label="Fechar chat">×</button>' +
      '</div>' +
      '<div class="mg__body" id="mgBody" aria-live="polite"></div>' +
      '<div class="mg-chips" id="mgChips"></div>' +
      '<div class="mg__ft">' +
        '<form class="mg__form" id="mgForm">' +
          '<textarea class="mg__in" id="mgIn" rows="1" placeholder="Escreva sua dúvida..." aria-label="Mensagem"></textarea>' +
          '<button class="mg__send" id="mgSend" type="submit" aria-label="Enviar" disabled>' + svgSend + '</button>' +
        '</form>' +
        '<p class="mg__note">Assistente virtual · respostas podem conter estimativas</p>' +
      '</div>' +
    '</div>';

  var host = document.createElement('div');
  host.innerHTML = html;
  document.body.appendChild(host);

  /* Remove o botao antigo de WhatsApp, se existir */
  var old = document.querySelector('.wpp');
  if (old) old.remove();

  var $ = function (id) { return document.getElementById(id); };
  var win = $('mgWin'), body = $('mgBody'), chips = $('mgChips'),
      input = $('mgIn'), send = $('mgSend'), form = $('mgForm'),
      openBtn = $('mgOpen'), tip = $('mgTip');

  var iniciado = false, ocupado = false;

  var scroll = function () { body.scrollTop = body.scrollHeight; };

  var addMsg = function (txt, quem) {
    var d = document.createElement('div');
    d.className = 'mg-msg mg-msg--' + quem;
    d.innerHTML = txt;
    body.appendChild(d);
    scroll();
  };

  var typing = function (on) {
    var t = body.querySelector('.mg-dots');
    if (on && !t) {
      var d = document.createElement('div');
      d.className = 'mg-dots';
      d.innerHTML = '<i></i><i></i><i></i>';
      body.appendChild(d);
      scroll();
    } else if (!on && t) {
      t.remove();
    }
  };

  var renderChips = function (lista) {
    chips.innerHTML = '';
    lista.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'mg-chip';
      b.textContent = c;
      b.addEventListener('click', function () { enviar(c); });
      chips.appendChild(b);
    });
  };

  var falar = function (txt) {
    ocupado = true;
    send.disabled = true;
    typing(true);
    var espera = CFG.delayMin + Math.random() * (CFG.delayMax - CFG.delayMin);

    var entregar = function (resposta) {
      typing(false);
      addMsg(resposta, 'bot');
      ocupado = false;
      send.disabled = !input.value.trim();
      renderChips(CHIPS);
    };

    if (CFG.endpoint) {
      fetch(CFG.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: txt })
      })
        .then(function (r) { return r.json(); })
        .then(function (d) { entregar(d.reply || responder(txt)); })
        .catch(function () { entregar(responder(txt)); });
    } else {
      setTimeout(function () { entregar(responder(txt)); }, espera);
    }
  };

  var enviar = function (txt) {
    var v = (txt || input.value).trim();
    if (!v || ocupado) return;
    addMsg(v.replace(/[<>]/g, ''), 'me');
    input.value = '';
    input.style.height = 'auto';
    send.disabled = true;
    chips.innerHTML = '';
    falar(v);
  };

  var abrir = function () {
    win.classList.add('is-open');
    openBtn.classList.add('is-read');
    tip.classList.remove('is-on');
    if (!iniciado) {
      iniciado = true;
      setTimeout(function () {
        addMsg('Olá! Sou o <b>Magnum</b>, assistente virtual da <b>M&amp;A Soluções Energéticas</b>. ⚡', 'bot');
        setTimeout(function () {
          addMsg('Posso te ajudar com custos, economia, financiamento e prazos de instalação. Sobre o que quer falar?', 'bot');
          renderChips(CHIPS);
        }, 700);
      }, 350);
    }
    if (window.innerWidth > 520) setTimeout(function () { input.focus(); }, 320);
  };

  var fechar = function () { win.classList.remove('is-open'); };

  openBtn.addEventListener('click', function () {
    win.classList.contains('is-open') ? fechar() : abrir();
  });
  $('mgClose').addEventListener('click', fechar);
  $('mgTipX').addEventListener('click', function (e) {
    e.stopPropagation();
    tip.classList.remove('is-on');
  });
  tip.addEventListener('click', abrir);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && win.classList.contains('is-open')) fechar();
  });

  form.addEventListener('submit', function (e) { e.preventDefault(); enviar(); });

  input.addEventListener('input', function () {
    send.disabled = !this.value.trim() || ocupado;
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 96) + 'px';
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); }
  });

  /* Convite automatico apos 8s */
  setTimeout(function () {
    if (!win.classList.contains('is-open')) tip.classList.add('is-on');
  }, 8000);
})();
