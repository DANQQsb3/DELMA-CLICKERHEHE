// Delma Clicker — pełna, naprawiona wersja

window.addEventListener('DOMContentLoaded', () => {
  // Pobierz elementy dopiero po załadowaniu DOM
  const el = {
    points: document.getElementById('points'),
    perClick: document.getElementById('perClick'),
    autoRate: document.getElementById('autoRate'),
    bigButton: document.getElementById('bigButton'),
    message: document.getElementById('message'),
    upgradeClickBtn: document.getElementById('upgradeClickBtn'),
    autoClickBtn: document.getElementById('autoClickBtn'),
    boosterBtn: document.getElementById('boosterBtn'),
    doubleClickBtn: document.getElementById('doubleClickBtn'),
    upgradeClickCost: document.getElementById('upgradeClickCost'),
    autoClickCost: document.getElementById('autoClickCost'),
    boosterCost: document.getElementById('boosterCost'),
    doubleClickCost: document.getElementById('doubleClickCost'),
    saveBtn: document.getElementById('saveBtn'),
    loadBtn: document.getElementById('loadBtn'),
    resetBtn: document.getElementById('resetBtn'),
  };

  // Prosta walidacja obecności kluczowych elementów
  if (!el.bigButton) {
    console.error('Brak #bigButton w HTML – sprawdź index.html');
    return;
  }

  const state = {
    points: 0,
    perClick: 1,
    autoRate: 0, // punkty na sekundę
    costs: {
      upgradeClick: 10,
      autoClick: 25,
      booster: 100,
      doubleClick: 500,
    },
    booster: {
      active: false,
      multiplier: 2,
      endsAt: 0,
    },
  };

  // Render UI
  function render() {
    el.points.textContent = Math.floor(state.points);
    const displayMult = state.booster.active ? state.booster.multiplier : 1;
    el.perClick.textContent = state.perClick * displayMult;
    el.autoRate.textContent = state.autoRate;
    el.upgradeClickCost.textContent = state.costs.upgradeClick;
    el.autoClickCost.textContent = state.costs.autoClick;
    el.boosterCost.textContent = state.costs.booster;
    el.doubleClickCost.textContent = state.costs.doubleClick;
  }

  // Wiadomości
  let msgTimer = null;
  function popMessage(text) {
    if (!el.message) return;
    el.message.textContent = text;
    if (msgTimer) clearTimeout(msgTimer);
    msgTimer = setTimeout(() => (el.message.textContent = ''), 2500);
  }

  // Klik
  function handleClick() {
    const mult = state.booster.active ? state.booster.multiplier : 1;
    state.points += state.perClick * mult;
    popMessage(`+${state.perClick * mult} punktów!`);
    render();
  }

  // Sklep: lepszy klik
  function buyClickUpgrade() {
    if (state.points < state.costs.upgradeClick) return popMessage('Za mało punktów.');
    state.points -= state.costs.upgradeClick;
    state.perClick += 1;
    state.costs.upgradeClick = Math.ceil(state.costs.upgradeClick * 1.25);
    popMessage('Kupiono: Lepszy klik!');
    render();
  }

  // Sklep: auto-kliker
  function buyAutoClick() {
    if (state.points < state.costs.autoClick) return popMessage('Za mało punktów.');
    state.points -= state.costs.autoClick;
    state.autoRate += 1; // +1 punkt/s
    state.costs.autoClick = Math.ceil(state.costs.autoClick * 1.35);
    popMessage('Kupiono: Auto-kliker!');
    render();
  }

  // Sklep: booster x2 (30s)
  function buyBooster() {
    if (state.points < state.costs.booster) return popMessage('Za mało punktów.');
    state.points -= state.costs.booster;
    state.booster.active = true;
    state.booster.endsAt = Date.now() + 30_000;
    state.costs.booster = Math.ceil(state.costs.booster * 1.5);
    popMessage('Booster aktywny! Kliki x2 przez 30s.');
    render();
  }

  // Sklep: Double Click (stały x2 do perClick)
  function buyDoubleClick() {
    if (state.points < state.costs.doubleClick) return popMessage('Za mało punktów.');
    state.points -= state.costs.doubleClick;
    state.perClick *= 2;
    state.costs.doubleClick = Math.ceil(state.costs.doubleClick * 2);
    popMessage('Kupiono: Double Click! Kliki podwojone.');
    render();
  }

  // Pętla gry (auto punkty, wygasanie boostera)
  let last = performance.now();
  function loop(now) {
    const dt = (now - last) / 1000;
    last = now;

    if (state.autoRate > 0) {
      state.points += state.autoRate * dt;
    }

    if (state.booster.active && Date.now() >= state.booster.endsAt) {
      state.booster.active = false;
      popMessage('Booster wygasł.');
    }

    render();
    requestAnimationFrame(loop);
  }

  // Zapis/Wczytanie
  const SAVE_KEY = 'delma-clicker-save';
  function saveGame() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    popMessage('Gra zapisana.');
  }
  function loadGame() {
    const data = localStorage.getItem(SAVE_KEY);
    if (!data) return popMessage('Brak zapisu.');
    try {
      const s = JSON.parse(data);
      if (typeof s.points === 'number') state.points = s.points;
      if (typeof s.perClick === 'number') state.perClick = s.perClick;
      if (typeof s.autoRate === 'number') state.autoRate = s.autoRate;
      if (s.costs) {
        if (typeof s.costs.upgradeClick === 'number') state.costs.upgradeClick = s.costs.upgradeClick;
        if (typeof s.costs.autoClick === 'number') state.costs.autoClick = s.costs.autoClick;
        if (typeof s.costs.booster === 'number') state.costs.booster = s.costs.booster;
        if (typeof s.costs.doubleClick === 'number') state.costs.doubleClick = s.costs.doubleClick;
      }
      if (s.booster) {
        state.booster.active = !!s.booster.active;
        state.booster.multiplier = 2;
        state.booster.endsAt = s.booster.endsAt || 0;
      }
      popMessage('Wczytano zapis.');
      render();
    } catch {
      popMessage('Błąd wczytywania.');
    }
  }
  function resetGame() {
    if (!confirm('Na pewno zresetować grę?')) return;
    state.points = 0;
    state.perClick = 1;
    state.autoRate = 0;
    state.costs.upgradeClick = 10;
    state.costs.autoClick = 25;
    state.costs.booster = 100;
    state.costs.doubleClick = 500;
    state.booster.active = false;
    state.booster.endsAt = 0;
    localStorage.removeItem(SAVE_KEY);
    popMessage('Zresetowano grę.');
    render();
  }

  // Eventy UI
  el.bigButton.addEventListener('click', handleClick);
  el.upgradeClickBtn.addEventListener('click', buyClickUpgrade);
  el.autoClickBtn.addEventListener('click', buyAutoClick);
  el.boosterBtn.addEventListener('click', buyBooster);
  el.doubleClickBtn.addEventListener('click', buyDoubleClick);
  el.saveBtn.addEventListener('click', saveGame);
  el.loadBtn.addEventListener('click', loadGame);
  el.resetBtn.addEventListener('click', resetGame);

  // Start
  render();
  requestAnimationFrame(loop);
});
