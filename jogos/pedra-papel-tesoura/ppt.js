/* ================================================================
   PEDRA, PAPEL E TESOURA — GAME LOGIC
   Responsibilities split into clear functions:
     startGame()          → start button → announce P1
     showPlayerTurn()     → fullscreen player name flash
     showChoiceButtons()  → move label up, show 3 choices
     handleChoice()       → store pick, transition to next step
     revealChoices()      → side-by-side reveal screen
     determineWinner()    → returns 0 (draw), 1, or 2
     showWinner()         → final winner screen
     resetGame()          → back to start screen
   ================================================================ */

/* ── CHOICE DATA ─────────────────────────────────────────────── */
const CHOICES = {
  rock:     { label: 'Pedra',   emoji: '🪨' },
  paper:    { label: 'Papel',   emoji: '📄' },
  scissors: { label: 'Tesoura', emoji: '✂️' },
};

/* What does each choice beat? */
const BEATS = {
  rock:     'scissors',
  scissors: 'paper',
  paper:    'rock',
};

/* ── STATE ───────────────────────────────────────────────────── */
let p1Choice     = null;   // 'rock' | 'paper' | 'scissors'
let p2Choice     = null;
let currentTurn  = 1;      // 1 or 2

/* ── DOM REFS ────────────────────────────────────────────────── */
const screens = {
  start:    document.getElementById('screenStart'),
  announce: document.getElementById('screenAnnounce'),
  choices:  document.getElementById('screenChoices'),
  reveal:   document.getElementById('screenReveal'),
  winner:   document.getElementById('screenWinner'),
};

const announceLabel      = document.getElementById('announceLabel');
const currentPlayerLabel = document.getElementById('currentPlayerLabel');
const revealEmojiP1      = document.getElementById('revealEmojiP1');
const revealEmojiP2      = document.getElementById('revealEmojiP2');
const revealNameP1       = document.getElementById('revealNameP1');
const revealNameP2       = document.getElementById('revealNameP2');
const revealCardP1       = document.getElementById('revealP1');
const revealCardP2       = document.getElementById('revealP2');
const winnerTitle        = document.getElementById('winnerTitle');
const winnerEyebrow      = document.getElementById('winnerEyebrow');
const winnerTrophies     = document.getElementById('winnerTrophies');

/* ── SCREEN SWITCHER ─────────────────────────────────────────── */
/**
 * Deactivate all screens then activate the target one.
 * The CSS .active class handles the fade+scale transition.
 */
function showScreen(id) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[id].classList.add('active');
}

/* ================================================================
   GAME FLOW
   ================================================================ */

/**
 * startGame()
 * Called when the user presses "Iniciar".
 * Resets state and kicks off Player 1's turn.
 */
function startGame() {
  p1Choice    = null;
  p2Choice    = null;
  currentTurn = 1;
  showPlayerTurn(1);
}

/* ── Step 1 / 3 ── Fullscreen player announcement ─────────────── */
/**
 * showPlayerTurn(player)
 * Flash the large "PLAYER X" badge for ~1 second,
 * then slide into the choice buttons.
 */
function showPlayerTurn(player) {
  currentTurn = player;

  // Apply colour class for the badge
  announceLabel.textContent = `PLAYER ${player}`;
  announceLabel.className   = 'announce-badge__label';
  announceLabel.classList.add(player === 1 ? 'p1-color' : 'p2-color');

  // Re-trigger the pop animation by cloning the badge
  const badge = document.querySelector('.announce-badge');
  badge.style.animation = 'none';
  void badge.offsetWidth;                      // reflow
  badge.style.animation = '';

  showScreen('announce');

  // After ~1 second, move on to the choice buttons
  setTimeout(() => showChoiceButtons(player), 1100);
}

/* ── Step 2 / 4 ── Choice buttons ─────────────────────────────── */
/**
 * showChoiceButtons(player)
 * Shows the compact player label and the three choice cards.
 */
function showChoiceButtons(player) {
  // Update the small "PLAYER X" label at the top
  currentPlayerLabel.textContent = `PLAYER ${player}`;
  currentPlayerLabel.className   = 'current-player-label';
  currentPlayerLabel.classList.add(player === 1 ? 'p1-color' : 'p2-color');

  // Re-enable all choice buttons (disabled after selection)
  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.disabled  = false;
    btn.style.opacity = '1';
  });

  showScreen('choices');
}

/* ── Input handling ─────────────────────────────────────────────── */
/**
 * handleChoice(choice)
 * Stores the current player's choice and advances the game.
 * Buttons are disabled immediately to prevent double-clicks.
 */
function handleChoice(choice) {
  // Disable buttons immediately
  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.disabled      = true;
    btn.style.opacity = '.4';
  });

  if (currentTurn === 1) {
    p1Choice = choice;
    // Wait briefly so the button state is visible, then show P2's turn
    setTimeout(() => showPlayerTurn(2), 280);
  } else {
    p2Choice = choice;
    setTimeout(revealChoices, 280);
  }
}

/* ── Step 4 ── Reveal choices side by side ──────────────────────── */
/**
 * revealChoices()
 * Populates the two reveal cards and shows the reveal screen.
 * After 3 seconds, advances to showWinner().
 */
function revealChoices() {
  // Populate P1 card
  revealEmojiP1.textContent = CHOICES[p1Choice].emoji;
  revealNameP1.textContent  = CHOICES[p1Choice].label;

  // Populate P2 card
  revealEmojiP2.textContent = CHOICES[p2Choice].emoji;
  revealNameP2.textContent  = CHOICES[p2Choice].label;

  // Clear previous winner highlights
  revealCardP1.classList.remove('is-winner');
  revealCardP2.classList.remove('is-winner');

  // Highlight the winner card (if not a draw)
  const winner = determineWinner();
  if (winner === 1) revealCardP1.classList.add('is-winner');
  if (winner === 2) revealCardP2.classList.add('is-winner');

  showScreen('reveal');

  // Auto-advance after 3 seconds
  setTimeout(showWinner, 3000);
}

/* ── Step 5 ── Winner announcement ─────────────────────────────── */
/**
 * determineWinner()
 * Pure function — returns 1, 2, or 0 (draw).
 */
function determineWinner() {
  if (p1Choice === p2Choice) return 0;
  if (BEATS[p1Choice] === p2Choice) return 1;
  return 2;
}

/**
 * showWinner()
 * Displays the result and auto-resets after 2.5 seconds.
 */
function showWinner() {
  const winner = determineWinner();

  winnerTitle.className   = 'winner-title';
  winnerEyebrow.textContent = 'Resultado';

  if (winner === 0) {
    winnerTitle.textContent   = 'Empate!';
    winnerTitle.classList.add('is-draw');
    winnerTrophies.textContent = '🤝';
  } else if (winner === 1) {
    winnerTitle.textContent   = 'Player 1 venceu!';
    winnerTitle.classList.add('p1-color');
    winnerTrophies.textContent = '🏆';
  } else {
    winnerTitle.textContent   = 'Player 2 venceu!';
    winnerTitle.classList.add('p2-color');
    winnerTrophies.textContent = '🏆';
  }

  showScreen('winner');

  // Auto-reset after 2.8 seconds
  setTimeout(resetGame, 2800);
}

/* ── Step 6 ── Reset ─────────────────────────────────────────────── */
/**
 * resetGame()
 * Clears state and returns to the start screen.
 */
function resetGame() {
  p1Choice    = null;
  p2Choice    = null;
  currentTurn = 1;
  showScreen('start');
}

/* ── Boot ────────────────────────────────────────────────────────── */
/* Ensure correct initial screen when the page loads                  */
showScreen('start');