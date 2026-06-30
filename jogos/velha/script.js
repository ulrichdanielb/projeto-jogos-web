const WINS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const MARKS = ['🍌','🐒'];
let board, turn, over, mode = '2p', scores = [0,0,0], history = [];

function cells() { return document.querySelectorAll('.cell'); }

function newGame() {
  board = Array(9).fill(null);
  turn = 0;
  over = false;
  cells().forEach(c => { c.textContent = ''; c.className = 'cell'; });
  setBanner();
}

function setBanner() {
  const b = document.getElementById('banner');
  b.className = 'turn-banner ' + (turn === 0 ? 'p1' : 'p2');
  b.textContent = "vez do jogador " + (turn === 0 ? '1 🍌' : (mode === 'cpu' ? 'cpu 🐒' : '2 🐒'));
}

function setMode(m) {
  mode = m;
  document.getElementById('btn2p').className  = 'mode-btn' + (m==='2p'  ? ' active' : '');
  document.getElementById('btnCpu').className = 'mode-btn' + (m==='cpu' ? ' active' : '');
  newGame();
}

function move(i) {
  if (over || board[i] !== null) return;
  place(i, turn);
  const w = checkWin();
  if (w) { endGame(w, turn); return; }
  if (board.every(v => v !== null)) { endGame(null, -1); return; }
  turn = 1 - turn;
  setBanner();
  if (mode === 'cpu' && turn === 1 && !over) setTimeout(cpuMove, 320);
}

function place(i, t) {
  board[i] = t;
  const c = document.querySelector(`.cell[data-i="${i}"]`);
  c.textContent = MARKS[t];
  c.classList.add('taken');
}

function checkWin() {
  for (const combo of WINS) {
    const [a,b,c] = combo;
    if (board[a] !== null && board[a] === board[b] && board[b] === board[c]) return combo;
  }
  return null;
}

function endGame(combo, winner) {
  over = true;
  const b = document.getElementById('banner');
  if (combo) {
    combo.forEach(i => document.querySelector(`.cell[data-i="${i}"]`).classList.add('win-cell'));
    b.className = 'turn-banner win';
    b.textContent = (winner === 0 ? '🍌 player 1' : (mode==='cpu' ? '🐒 cpu' : '🐒 player 2')) + ' wins!';
    scores[winner]++;
    history.unshift(`<span class="chip ${winner===0?'chip-win':'chip-lose'}">${MARKS[winner]}</span>`);
  } else {
    b.className = 'turn-banner draw';
    b.textContent = '🍌 velha 🐒';
    scores[2]++;
    history.unshift('<span class="chip chip-draw">=</span>');
  }
  document.getElementById('s1').textContent = scores[0];
  document.getElementById('s2').textContent = scores[1];
  document.getElementById('sd').textContent = scores[2];
  if (history.length > 14) history.pop();
  document.getElementById('hist').innerHTML = history.join('');
}

function cpuMove() {
  if (over) return;
  let i = bestMove();
  move(i);
}

function bestMove() {
  for (const combo of WINS) {
    const [a,b,c] = combo;
    const vals = [board[a],board[b],board[c]];
    if (vals.filter(v=>v===1).length===2 && vals.includes(null)) return combo[vals.indexOf(null)];
  }
  for (const combo of WINS) {
    const [a,b,c] = combo;
    const vals = [board[a],board[b],board[c]];
    if (vals.filter(v=>v===0).length===2 && vals.includes(null)) return combo[vals.indexOf(null)];
  }
  if (board[4]===null) return 4;
  const corners = [0,2,6,8].filter(i=>board[i]===null);
  if (corners.length) return corners[Math.floor(Math.random()*corners.length)];
  return board.findIndex(v=>v===null);
}

newGame();
