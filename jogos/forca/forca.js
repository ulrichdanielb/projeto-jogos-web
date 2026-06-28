// ============================================================
//  DADOS — banco de palavras (modo 1 jogador)
// ============================================================
const PALAVRAS = [
  { palavra: "BANANA",    dica: "Fruta favorita do macaco" },
  { palavra: "MACACO",    dica: "Animal que vive na selva" },
  { palavra: "SELVA",     dica: "Floresta tropical densa" },
  { palavra: "CIPÓ",      dica: "Planta que o macaco usa pra se balançar" },
  { palavra: "URSO",      dica: "Animal que adora mel" },
  { palavra: "ARVORE",    dica: "Planta onde o macaco mora" },
  { palavra: "PRIMATA",   dica: "Grupo de mamíferos que inclui macacos" },
  { palavra: "FLORESTA",  dica: "Bioma cheio de árvores" },
  { palavra: "GALHO",     dica: "Parte da árvore onde o macaco se pentura" },
  { palavra: "FRUTA",     dica: "Alimento que o macaco adora" },
  { palavra: "CHIMPANZE", dica: "Parente inteligente do humano" },
  { palavra: "GIBAO",     dica: "Macaco de braços longos" },
  { palavra: "ZOOLOGICO", dica: "Lugar onde animais são exibidos" },
  { palavra: "TARSIO",    dica: "Primata pequeno de olhos grandes" },
  { palavra: "MANDRIL",   dica: "Macaco colorido e grande" },
];

// ============================================================
//  ESTADO GLOBAL
// ============================================================
let palavraAtual   = "";
let dicaAtual      = "";
let letrasChutadas = [];
let erros          = 0;
const MAX_ERROS    = 6;
let modoJogo       = "1p"; // "1p" ou "2p"
let jogoAtivo      = false;

// ============================================================
//  CANVAS — PIXEL ART DO MACACO
// ============================================================
const canvas = document.getElementById('monkey-canvas');
const ctx    = canvas.getContext('2d');
const SCALE  = 3; // cada "pixel" do desenho = 3px reais

// Paleta de cores
const C = {
  WOOD:  '#8B5E3C',
  ROPE:  '#D4A84B',
  FUR:   '#C68B3A',
  DARK:  '#7A4A10',
  FACE:  '#F5CBA7',
  EYE:   '#1a0a2e',
  MOUTH: '#7A4A10',
  RED:   '#e63946',
  SKIN:  '#EAC08A',
};

// Pinta um quadradinho na grade
function fillPixel(col, row, color) {
  if (!color) return;
  ctx.fillStyle = color;
  ctx.fillRect(col * SCALE, row * SCALE, SCALE, SCALE);
}

// --- Partes da forca e do macaco ---

function drawForca() {
  const madeira = [
    [32,38],[33,38],[34,38],[35,38],[36,38],[37,38],[38,38],[39,38],[40,38],
    [36,7],[36,8],[36,9],[36,10],[36,11],[36,12],[36,13],[36,14],
    [36,15],[36,16],[36,17],[36,18],[36,19],[36,20],[36,21],[36,22],
    [36,23],[36,24],[36,25],[36,26],[36,27],[36,28],[36,29],[36,30],
    [36,31],[36,32],[36,33],[36,34],[36,35],[36,36],[36,37],
    [36,7],[37,7],[38,7],[39,7],[40,7],[41,7],[42,7],[43,7],[44,7],[45,7],
    [37,8],[38,9],[39,10],[40,11],
  ];
  madeira.forEach(([x, y]) => fillPixel(x, y, C.WOOD));
  [[45,8],[45,9],[45,10],[45,11]].forEach(([x, y]) => fillPixel(x, y, C.ROPE));
}

function drawCabeca(morto) {
  const cor     = morto ? C.RED  : C.FUR;
  const corFace = morto ? '#ffaaaa' : C.FACE;

  [
    [43,12],[44,12],[45,12],[46,12],[47,12],
    [42,13],[43,13],[44,13],[45,13],[46,13],[47,13],[48,13],
    [42,14],[43,14],[44,14],[45,14],[46,14],[47,14],[48,14],
    [42,15],[43,15],[44,15],[45,15],[46,15],[47,15],[48,15],
    [42,16],[43,16],[44,16],[45,16],[46,16],[47,16],[48,16],
    [43,17],[44,17],[45,17],[46,17],[47,17],
  ].forEach(([x, y]) => fillPixel(x, y, cor));

  [
    [44,14],[45,14],[46,14],
    [43,15],[44,15],[45,15],[46,15],[47,15],
    [43,16],[44,16],[45,16],[46,16],[47,16],
  ].forEach(([x, y]) => fillPixel(x, y, corFace));

  [[42,14],[42,15],[42,16]].forEach(([x, y]) => fillPixel(x, y, C.DARK));
  [[48,14],[48,15],[48,16]].forEach(([x, y]) => fillPixel(x, y, C.DARK));

  if (morto) {
    fillPixel(44,14,C.EYE); fillPixel(44,15,C.EYE);
    fillPixel(46,14,C.EYE); fillPixel(46,15,C.EYE);
    [[43,14],[45,14],[47,14],[43,15],[45,15],[47,15]]
      .forEach(([x, y]) => fillPixel(x, y, '#ff0000'));
  } else {
    fillPixel(44, 14, C.EYE);
    fillPixel(46, 14, C.EYE);
    fillPixel(45, 16, C.MOUTH);
  }
}

function drawCorpo(morto) {
  const cor = morto ? C.RED : C.FUR;
  [
    [44,18],[45,18],[46,18],
    [43,19],[44,19],[45,19],[46,19],[47,19],
    [43,20],[44,20],[45,20],[46,20],[47,20],
    [44,21],[45,21],[46,21],
    [44,22],[45,22],[46,22],
    [44,23],[45,23],[46,23],
  ].forEach(([x, y]) => fillPixel(x, y, cor));
}

function drawBracoEsq(morto) {
  const cor = morto ? C.RED : C.FUR;
  [[43,19],[42,20],[41,21],[40,22],[40,23]].forEach(([x, y]) => fillPixel(x, y, cor));
  fillPixel(39, 23, C.SKIN);
  fillPixel(39, 24, C.SKIN);
}

function drawBracoDir(morto) {
  const cor = morto ? C.RED : C.FUR;
  [[47,19],[48,20],[49,21],[49,22]].forEach(([x, y]) => fillPixel(x, y, cor));
  fillPixel(49, 23, C.SKIN);
  fillPixel(50, 23, C.SKIN);
}

function drawPernaEsq(morto) {
  const cor = morto ? C.RED : C.FUR;
  [[44,24],[44,25],[43,26],[43,27],[42,28],[42,29]].forEach(([x, y]) => fillPixel(x, y, cor));
  fillPixel(41, 30, C.SKIN);
  fillPixel(40, 30, C.SKIN);
}

function drawPernaDir(morto) {
  const cor = morto ? C.RED : C.FUR;
  [[46,24],[46,25],[47,26],[47,27],[48,28],[48,29]].forEach(([x, y]) => fillPixel(x, y, cor));
  fillPixel(49, 30, C.SKIN);
  fillPixel(50, 30, C.SKIN);
}

// Renderiza o macaco de acordo com o número de erros
function renderMonkey() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const morto = erros >= MAX_ERROS;

  drawForca();
  if (erros >= 1) drawCabeca(morto);
  if (erros >= 2) drawCorpo(morto);
  if (erros >= 3) drawBracoEsq(morto);
  if (erros >= 4) drawBracoDir(morto);
  if (erros >= 5) drawPernaEsq(morto);
  if (erros >= 6) drawPernaDir(morto);
}

// ============================================================
//  RENDERIZAÇÃO DA PALAVRA
// ============================================================
function renderPalavra() {
  const container = document.getElementById('palavra-container');
  container.innerHTML = '';

  for (const letra of palavraAtual) {
    const slot = document.createElement('div');
    slot.className = 'letra-slot';

    const char = document.createElement('div');
    char.className = 'letra-char';

    if (letra === ' ') {
      char.style.minWidth = '28px';
      char.textContent = '';
    } else if (letrasChutadas.includes(letra)) {
      char.textContent = letra;
      char.classList.add('revelada');
    } else {
      char.textContent = '_';
    }

    const linha = document.createElement('div');
    linha.className = 'letra-linha';
    if (letra === ' ') linha.style.background = 'transparent';

    slot.appendChild(char);
    slot.appendChild(linha);
    container.appendChild(slot);
  }
}

// ============================================================
//  TECLADO VIRTUAL
// ============================================================
function criarTeclado() {
  const teclado = document.getElementById('teclado');
  teclado.innerHTML = '';

  for (const letra of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    const btn = document.createElement('button');
    btn.className    = 'tecla';
    btn.textContent  = letra;
    btn.dataset.letra = letra;
    btn.addEventListener('click', () => chutar(letra));
    teclado.appendChild(btn);
  }
}

function atualizarTeclado() {
  document.querySelectorAll('.tecla').forEach(btn => {
    const letra = btn.dataset.letra;
    if (letrasChutadas.includes(letra)) {
      btn.disabled = true;
      btn.classList.add(palavraAtual.includes(letra) ? 'acerto' : 'erro');
    }
  });
}

// ============================================================
//  CHUTAR LETRA
// ============================================================
function chutar(letra) {
  if (!jogoAtivo || letrasChutadas.includes(letra)) return;

  letrasChutadas.push(letra);

  if (!palavraAtual.includes(letra)) {
    erros++;
    animarErro();
  }

  atualizarTeclado();
  renderPalavra();
  renderMonkey();
  atualizarVidas();
  verificarFimDeJogo();
}

// ============================================================
//  ADIVINHAR A PALAVRA INTEIRA
// ============================================================
function tentarAdivinharPalavra() {
  if (!jogoAtivo) return;

  const input     = document.getElementById('input-adivinhar');
  const tentativa = input.value.trim().toUpperCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // ignora acentos
  const alvo = palavraAtual.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  input.value = '';
  if (tentativa.length === 0) return;

  if (tentativa === alvo) {
    // Revela todas as letras
    const letrasUnicas = [...new Set(palavraAtual.split('').filter(l => l !== ' '))];
    letrasUnicas.forEach(l => {
      if (!letrasChutadas.includes(l)) letrasChutadas.push(l);
    });
    renderPalavra();
    atualizarTeclado();
    jogoAtivo = false;
    bloquearTudo();
    setTimeout(celebrarVitoria, 400);
  } else {
    erros++;
    animarErro();
    renderMonkey();
    atualizarVidas();
    const msg = document.getElementById('mensagem');
    msg.textContent = `✗ "${tentativa}" NÃO É A PALAVRA!`;
    setTimeout(() => { if (jogoAtivo) msg.textContent = ''; }, 1800);
    verificarFimDeJogo();
  }
}

function animarErro() {
  const gc = document.getElementById('game-container');
  gc.classList.remove('shake');
  void gc.offsetWidth; // força reflow para reiniciar animação
  gc.classList.add('shake');
}

// ============================================================
//  BANANAS DE VIDA
// ============================================================
function svgBanana(ativa) {
  const cor1 = ativa ? '#f9c74f' : '#555'; // casca principal
  const cor2 = ativa ? '#e0a800' : '#333'; // sombra
  const cor3 = ativa ? '#fff176' : '#666'; // brilho

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 16" width="18" height="18" shape-rendering="crispEdges">
    <rect x="4" y="0"  width="2" height="2"  fill="${cor2}"/>
    <rect x="5" y="2"  width="2" height="1"  fill="${cor1}"/>
    <rect x="6" y="3"  width="2" height="1"  fill="${cor1}"/>
    <rect x="6" y="4"  width="2" height="2"  fill="${cor1}"/>
    <rect x="5" y="6"  width="2" height="2"  fill="${cor1}"/>
    <rect x="3" y="8"  width="3" height="2"  fill="${cor1}"/>
    <rect x="2" y="10" width="3" height="2"  fill="${cor1}"/>
    <rect x="2" y="12" width="2" height="1"  fill="${cor1}"/>
    <rect x="5" y="3"  width="1" height="1"  fill="${cor3}"/>
    <rect x="5" y="4"  width="1" height="2"  fill="${cor3}"/>
    <rect x="3" y="9"  width="1" height="2"  fill="${cor2}"/>
    <rect x="2" y="11" width="1" height="2"  fill="${cor2}"/>
    <rect x="2" y="13" width="1" height="1"  fill="${cor2}"/>
  </svg>`;
}

function atualizarVidas() {
  const container = document.getElementById('vidas');
  container.innerHTML = '';

  for (let i = 0; i < MAX_ERROS; i++) {
    const v = document.createElement('div');
    v.className = 'vida-banana' + (i < erros ? ' perdida' : '');
    v.innerHTML = svgBanana(i >= erros);
    v.title     = i < erros ? 'Vida perdida' : 'Vida restante';
    container.appendChild(v);
  }

  document.getElementById('tentativas-texto').textContent = `ERROS: ${erros} / ${MAX_ERROS}`;
}

// ============================================================
//  FOGOS DE ARTIFÍCIO COM BANANAS 🍌
// ============================================================
const fogosCanvas = document.getElementById('fogos-canvas');
const fogosCtx    = fogosCanvas.getContext('2d');
let fogosAtivos   = false;
let fogosRAF      = null;
const particulas  = [];

const EMOJIS_FOGO = ['🍌', '🍌', '🍌', '🐒', '⭐', '✨'];

class Particula {
  constructor() {
    this.reset(true);
  }

  reset(init = false) {
    this.x        = Math.random() * fogosCanvas.width;
    this.y        = init ? Math.random() * fogosCanvas.height : fogosCanvas.height + 20;
    this.vx       = (Math.random() - 0.5) * 4;
    this.vy       = -(Math.random() * 8 + 6);
    this.grav     = 0.18;
    this.vida     = 0;
    this.maxVida  = Math.random() * 80 + 60;
    this.emoji    = EMOJIS_FOGO[Math.floor(Math.random() * EMOJIS_FOGO.length)];
    this.tamanho  = Math.random() * 14 + 16;
    this.rot      = Math.random() * Math.PI * 2;
    this.rotV     = (Math.random() - 0.5) * 0.2;
    this.explodiu = false;
    this.filhos   = [];
  }

  update() {
    this.vida++;
    this.x   += this.vx;
    this.vy  += this.grav;
    this.y   += this.vy;
    this.rot += this.rotV;

    // Na metade da vida, estoura em mini-partículas
    if (!this.explodiu && this.vida > this.maxVida * 0.5) {
      this.explodiu = true;
      for (let i = 0; i < 6; i++) {
        this.filhos.push({
          x: this.x, y: this.y,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          vida: 0, maxVida: 30,
          emoji: '🍌',
          tamanho: 10,
          rot: Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 0.3,
          grav: 0.12,
        });
      }
    }

    this.filhos = this.filhos.filter(f => f.vida < f.maxVida);
    this.filhos.forEach(f => {
      f.vida++;
      f.x  += f.vx;
      f.vy += f.grav;
      f.y  += f.vy;
      f.rot += f.rotV;
    });

    return this.vida < this.maxVida;
  }

  draw(ctx) {
    const alpha = 1 - this.vida / this.maxVida;
    ctx.save();
    ctx.globalAlpha    = alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.font           = `${this.tamanho}px serif`;
    ctx.textAlign      = 'center';
    ctx.textBaseline   = 'middle';
    ctx.fillText(this.emoji, 0, 0);
    ctx.restore();

    this.filhos.forEach(f => {
      const a = 1 - f.vida / f.maxVida;
      ctx.save();
      ctx.globalAlpha  = a * 0.8;
      ctx.translate(f.x, f.y);
      ctx.rotate(f.rot);
      ctx.font         = `${f.tamanho}px serif`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(f.emoji, 0, 0);
      ctx.restore();
    });
  }
}

function loopFogos() {
  if (!fogosAtivos) return;

  fogosCanvas.width  = window.innerWidth;
  fogosCanvas.height = window.innerHeight;
  fogosCtx.clearRect(0, 0, fogosCanvas.width, fogosCanvas.height);

  if (Math.random() < 0.25) particulas.push(new Particula());

  for (let i = particulas.length - 1; i >= 0; i--) {
    const viva = particulas[i].update();
    particulas[i].draw(fogosCtx);
    if (!viva) particulas.splice(i, 1);
  }

  fogosRAF = requestAnimationFrame(loopFogos);
}

function iniciarFogos() {
  fogosAtivos        = true;
  fogosCanvas.style.display = 'block';
  fogosCanvas.width  = window.innerWidth;
  fogosCanvas.height = window.innerHeight;
  particulas.length  = 0;
  for (let i = 0; i < 20; i++) particulas.push(new Particula());
  loopFogos();
}

function pararFogos() {
  fogosAtivos = false;
  if (fogosRAF) cancelAnimationFrame(fogosRAF);
  fogosCtx.clearRect(0, 0, fogosCanvas.width, fogosCanvas.height);
  fogosCanvas.style.display = 'none';
  particulas.length = 0;
}

// ============================================================
//  CELEBRAÇÃO DE VITÓRIA
// ============================================================
function celebrarVitoria() {
  iniciarFogos();
  document.getElementById('overlay-vitoria').classList.add('ativo');
}

// ============================================================
//  VERIFICAR FIM DE JOGO
// ============================================================
function verificarFimDeJogo() {
  if (!jogoAtivo) return;

  const msg    = document.getElementById('mensagem');
  const ganhou = [...palavraAtual].every(l => l === ' ' || letrasChutadas.includes(l));

  if (ganhou) {
    bloquearTudo();
    jogoAtivo = false;
    setTimeout(celebrarVitoria, 400);
    return;
  }

  if (erros >= MAX_ERROS) {
    msg.textContent = `💀 FIM! ERA: ${palavraAtual}`;
    bloquearTudo();
    jogoAtivo = false;
  }
}

function bloquearTudo() {
  document.querySelectorAll('.tecla').forEach(b => b.disabled = true);
  document.getElementById('btn-adivinhar').disabled  = true;
  document.getElementById('input-adivinhar').disabled = true;
}

// ============================================================
//  INICIAR JOGO
// ============================================================
function iniciarJogo(palavra, dica) {
  palavraAtual   = palavra.toUpperCase();
  dicaAtual      = dica || '';
  letrasChutadas = [];
  erros          = 0;
  jogoAtivo      = true;

  document.getElementById('badge-modo').textContent =
    modoJogo === '2p' ? 'MODO: 2 JOGADORES 🍌🍌' : 'MODO: 1 JOGADOR 🐒';
  document.getElementById('dica-texto').textContent =
    dicaAtual ? `DICA: ${dicaAtual}` : 'DICA: —';
  document.getElementById('mensagem').textContent       = '';
  document.getElementById('input-adivinhar').value      = '';
  document.getElementById('input-adivinhar').disabled   = false;
  document.getElementById('btn-adivinhar').disabled     = false;

  criarTeclado();
  atualizarVidas();
  renderPalavra();
  renderMonkey();
  mostrarTela('tela-jogo');
}

// ============================================================
//  NAVEGAÇÃO DE TELAS
// ============================================================
function mostrarTela(id) {
  ['tela-modo', 'tela-entrada', 'tela-jogo'].forEach(t => {
    const el = document.getElementById(t);
    el.style.display = (t === id)
      ? (t === 'tela-modo' ? 'flex' : 'block')
      : 'none';
  });
}

// ============================================================
//  EVENTOS DOS BOTÕES
// ============================================================

// Modo 1 jogador
document.getElementById('btn-1p').addEventListener('click', () => {
  modoJogo = '1p';
  const sorteio = PALAVRAS[Math.floor(Math.random() * PALAVRAS.length)];
  iniciarJogo(sorteio.palavra, sorteio.dica);
});

// Modo 2 jogadores — vai para tela de entrada
document.getElementById('btn-2p').addEventListener('click', () => {
  modoJogo = '2p';
  document.getElementById('input-palavra-2p').value       = '';
  document.getElementById('input-dica-2p').value          = '';
  document.getElementById('aviso-entrada').textContent    = '';
  mostrarTela('tela-entrada');
  document.getElementById('input-palavra-2p').focus();
});

// Voltar ao menu de modo
document.getElementById('btn-voltar-modo').addEventListener('click', () => {
  mostrarTela('tela-modo');
});

// Confirmar palavra do jogador 1 (modo 2P)
function confirmarPalavra2P() {
  const inputP = document.getElementById('input-palavra-2p');
  const inputD = document.getElementById('input-dica-2p');
  const aviso  = document.getElementById('aviso-entrada');

  const palavra = inputP.value.trim().toUpperCase();
  const dica    = inputD.value.trim();

  if (palavra.length < 2) {
    aviso.textContent = '⚠ MÍNIMO 2 LETRAS!';
    inputP.focus();
    return;
  }
  if (!/^[A-ZÀ-Ú\s]+$/.test(palavra)) {
    aviso.textContent = '⚠ USE APENAS LETRAS!';
    inputP.focus();
    return;
  }

  aviso.textContent = '';
  iniciarJogo(palavra, dica);
}

document.getElementById('btn-confirmar-palavra').addEventListener('click', confirmarPalavra2P);

document.getElementById('input-palavra-2p').addEventListener('keydown', e => {
  if (e.key === 'Enter') confirmarPalavra2P();
});

// Novo jogo
document.getElementById('btn-novo').addEventListener('click', () => {
  if (modoJogo === '2p') {
    document.getElementById('input-palavra-2p').value    = '';
    document.getElementById('input-dica-2p').value       = '';
    document.getElementById('aviso-entrada').textContent = '';
    mostrarTela('tela-entrada');
    document.getElementById('input-palavra-2p').focus();
  } else {
    const sorteio = PALAVRAS[Math.floor(Math.random() * PALAVRAS.length)];
    iniciarJogo(sorteio.palavra, sorteio.dica);
  }
});

// Trocar modo
document.getElementById('btn-trocar-modo').addEventListener('click', () => {
  mostrarTela('tela-modo');
});

// Botão adivinhar palavra
document.getElementById('btn-adivinhar').addEventListener('click', tentarAdivinharPalavra);

// Enter no input de adivinhar
document.getElementById('input-adivinhar').addEventListener('keydown', e => {
  if (e.key === 'Enter') tentarAdivinharPalavra();
});

// Teclado físico do computador
document.addEventListener('keydown', e => {
  const tela = document.getElementById('tela-jogo');
  if (tela.style.display === 'none') return;
  if (document.activeElement === document.getElementById('input-adivinhar')) return;
  const letra = e.key.toUpperCase();
  if (/^[A-Z]$/.test(letra)) chutar(letra);
});

// Botão "JOGAR DE NOVO" no overlay de vitória
document.getElementById('btn-novo-vitoria').addEventListener('click', () => {
  pararFogos();
  document.getElementById('overlay-vitoria').classList.remove('ativo');
  if (modoJogo === '2p') {
    document.getElementById('input-palavra-2p').value    = '';
    document.getElementById('input-dica-2p').value       = '';
    document.getElementById('aviso-entrada').textContent = '';
    mostrarTela('tela-entrada');
    document.getElementById('input-palavra-2p').focus();
  } else {
    const sorteio = PALAVRAS[Math.floor(Math.random() * PALAVRAS.length)];
    iniciarJogo(sorteio.palavra, sorteio.dica);
  }
});

// ============================================================
//  INICIALIZAÇÃO — começa na tela de seleção de modo
// ============================================================
mostrarTela('tela-modo');