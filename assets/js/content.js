/* ==========================================================================
   M&A SOLUÇÕES ENERGÉTICAS · content.js
   Fonte única de dados: obras e cidades atendidas.
   Alterar aqui reflete em todas as páginas.
   ========================================================================== */
window.MA = (function () {
  'use strict';

  const WA = '5545991262160';

  /* ---------- OBRAS ---------- */
  /* home: true  → aparece na galeria da página inicial (use 6)
     ig:          → permalink do post no Instagram, ou null              */
  const obras = [
    { img:'assets/img/obras/obra-01.jpg', tipo:'Rural',       titulo:'Aviário 92 kWp',            local:'Missal/PR',                desc:'Estrutura em telhado metálico com 168 módulos e dois inversores trifásicos.', home:true,  ig:'https://www.instagram.com/p/SUBSTITUA/' },
    { img:'assets/img/obras/obra-02.jpg', tipo:'Residencial', titulo:'Residência 8,4 kWp',        local:'Medianeira/PR',            desc:'Telha cerâmica, 14 módulos, conta reduzida à taxa mínima.',                    home:true,  ig:null },
    { img:'assets/img/obras/obra-03.jpg', tipo:'Empresarial', titulo:'Distribuidora 46 kWp',      local:'Foz do Iguaçu/PR',         desc:'Galpão comercial com redução de 88% no custo fixo de energia.',                home:true,  ig:null },
    { img:'assets/img/obras/obra-04.jpg', tipo:'Rural',       titulo:'Irrigação 30 kWp',          local:'Santa Helena/PR',          desc:'Sistema em solo dimensionado para pivô e casa de bombas.',                     home:true,  ig:null },
    { img:'assets/img/obras/obra-05.jpg', tipo:'Residencial', titulo:'Sobrado 12,6 kWp',          local:'São Miguel do Iguaçu/PR',  desc:'Duas águas com orientações distintas e otimizadores por string.',              home:true,  ig:null },
    { img:'assets/img/obras/obra-06.jpg', tipo:'Empresarial', titulo:'Frigorífico 120 kWp',       local:'Matelândia/PR',            desc:'Usina de médio porte com monitoramento remoto por planta.',                    home:true,  ig:null },
    { img:'assets/img/obras/obra-07.jpg', tipo:'Rural',       titulo:'Suinocultura 64 kWp',       local:'Itaipulândia/PR',          desc:'Crédito rural aprovado em 120 meses com carência de 6 meses.',                 home:false, ig:null },
    { img:'assets/img/obras/obra-08.jpg', tipo:'Residencial', titulo:'Residência 5,6 kWp',        local:'Serranópolis do Iguaçu/PR',desc:'Instalação concluída em um único dia útil.',                                   home:false, ig:null },
    { img:'assets/img/obras/obra-09.jpg', tipo:'Empresarial', titulo:'Supermercado 78 kWp',       local:'Cascavel/PR',              desc:'Compensação remota entre duas unidades consumidoras.',                         home:false, ig:null }
  ];

  /* ---------- CIDADES ---------- */
  const cidades = [
    { nome:'Medianeira',               slug:'energia-solar-medianeira',                uf:'PR', tag:'Sede',     desc:'Nossa base. Atendimento no mesmo dia e visita técnica sem custo.' },
    { nome:'Missal',                   slug:'energia-solar-missal',                    uf:'PR', tag:'18 km',    desc:'Forte atuação em aviários e propriedades rurais.' },
    { nome:'Itaipulândia',             slug:'energia-solar-itaipulandia',              uf:'PR', tag:'32 km',    desc:'Projetos residenciais e de suinocultura homologados na Copel.' },
    { nome:'Serranópolis do Iguaçu',   slug:'energia-solar-serranopolis-do-iguacu',    uf:'PR', tag:'26 km',    desc:'Sistemas em solo e telhado para pequenas propriedades.' },
    { nome:'São Miguel do Iguaçu',     slug:'energia-solar-sao-miguel-do-iguacu',      uf:'PR', tag:'28 km',    desc:'Residencial, comércio e irrigação com payback de 3 a 4 anos.' },
    { nome:'Matelândia',               slug:'energia-solar-matelandia',                uf:'PR', tag:'22 km',    desc:'Indústria e agro, incluindo usinas acima de 100 kWp.' },
    { nome:'Ramilândia',               slug:'energia-solar-ramilandia',                uf:'PR', tag:'38 km',    desc:'Atendimento rural com estrutura em solo.' },
    { nome:'Céu Azul',                 slug:'energia-solar-ceu-azul',                  uf:'PR', tag:'42 km',    desc:'Projetos residenciais e para o setor de serviços.' },
    { nome:'Santa Helena',             slug:'energia-solar-santa-helena',              uf:'PR', tag:'58 km',    desc:'Irrigação, secadores e granjas de grande consumo.' },
    { nome:'São José das Palmeiras',   slug:'energia-solar-sao-jose-das-palmeiras',    uf:'PR', tag:'62 km',    desc:'Sistemas compactos com o melhor custo por kWp.' },
    { nome:'Diamante do Oeste',        slug:'energia-solar-diamante-do-oeste',         uf:'PR', tag:'56 km',    desc:'Residencial e rural com crédito facilitado.' },
    { nome:'Foz do Iguaçu',            slug:'energia-solar-foz-do-iguacu',             uf:'PR', tag:'68 km',    desc:'Hotelaria, comércio e residências de alto consumo.' },
    { nome:'Marechal Cândido Rondon',  slug:'energia-solar-marechal-candido-rondon',   uf:'PR', tag:'88 km',    desc:'Agroindústria e aviários com projeto dedicado.' },
    { nome:'Toledo',                   slug:'energia-solar-toledo',                    uf:'PR', tag:'96 km',    desc:'Indústria e comércio, com análise de demanda contratada.' },
    { nome:'Cascavel',                 slug:'energia-solar-cascavel',                  uf:'PR', tag:'118 km',   desc:'Usinas empresariais e compensação entre unidades.' }
  ];

  return { WA, obras, cidades };
})();
