/* Fonte única de verdade. Altere aqui, reflete em todas as páginas. */
window.MA = {
  empresa: {
    nome: 'MA Soluções Energéticas',
    legal: 'MA Soluções Energéticas LTDA',
    tel: '+5545991262160',
    telFmt: '(45) 99126-2160',
    email: 'contato@masolucoesenergeticas.com.br',
    rua: 'Av. Brasil, 3030',
    cidade: 'Medianeira',
    uf: 'PR',
    cep: '85884-000',
    lat: -25.2958,
    lng: -54.0940,
    site: 'https://masolucoesenergeticas.com.br',
    horario: 'Seg–Sex 08:00–18:00 · Sáb 08:00–12:00'
  },

  wa: {
    numero: '5545991262160',        // ← AJUSTE
    msg: (cidade) =>
      `Olá! Vi o site e quero um orçamento de energia solar${cidade ? ' em ' + cidade : ''}.`,
    link(cidade) {
      return `https://wa.me/${this.numero}?text=${encodeURIComponent(this.msg(cidade))}`;
    }
  },

  cidades: [
    { s: 'medianeira',        n: 'Medianeira',            lat: -25.2958, lng: -54.0940 },
    { s: 'missal',            n: 'Missal',                lat: -25.0919, lng: -54.2436 },
    { s: 'itaipulandia',      n: 'Itaipulândia',          lat: -25.1447, lng: -54.3072 },
    { s: 'sao-miguel-do-iguacu', n: 'São Miguel do Iguaçu', lat: -25.3486, lng: -54.2381 },
    { s: 'santa-helena',      n: 'Santa Helena',          lat: -24.8597, lng: -54.3328 },
    { s: 'serranopolis-do-iguacu', n: 'Serranópolis do Iguaçu', lat: -25.3958, lng: -54.0475 },
    { s: 'ramilandia',        n: 'Ramilândia',            lat: -25.1178, lng: -54.0292 },
    { s: 'matelandia',        n: 'Matelândia',            lat: -25.2528, lng: -53.9964 },
    { s: 'cespar',            n: 'Céu Azul',              lat: -25.1500, lng: -53.8419 },
    { s: 'foz-do-iguacu',     n: 'Foz do Iguaçu',         lat: -25.5469, lng: -54.5882 },
    { s: 'cascavel',          n: 'Cascavel',              lat: -24.9555, lng: -53.4552 },
    { s: 'toledo',            n: 'Toledo',                lat: -24.7250, lng: -53.7431 },
    { s: 'marechal-candido-rondon', n: 'Marechal Cândido Rondon', lat: -24.5561, lng: -54.0553 },
    { s: 'sao-jose-das-palmeiras', n: 'São José das Palmeiras', lat: -24.8394, lng: -54.0653 },
    { s: 'diamante-do-oeste', n: 'Diamante do Oeste',     lat: -24.9425, lng: -54.1044 }
  ],

  servicos: [
    { s: '',                       t: 'Energia Solar' },
    { s: 'preco-',                 t: 'Preço e Orçamento' },
    { s: 'residencial-',           t: 'Residencial' },
    { s: 'empresa-',               t: 'Empresarial' },
    { s: 'rural-',                 t: 'Rural e Agronegócio' }
  ],

  /* 12 fotos fixas usadas nas 135 páginas */
  obras: Array.from({ length: 12 }, (_, i) => {
    const n = String(i + 1).padStart(2, '0');
    return { src: `assets/img/obras/aviario-${n}.webp`, alt: `Instalação de energia solar em aviário — obra ${n}` };
  })
};
