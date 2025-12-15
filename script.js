window.addEventListener('DOMContentLoaded', () => {
  const el = {
    points: document.getElementById('points'),
    pointsTop: document.getElementById('pointsTop'),
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
    rebirths: document.getElementById('rebirths'),
    rebirthMultiplier: document.getElementById('rebirthMultiplier'),
    nextRebirthCost: document.getElementById('nextRebirthCost'),
    rebirthBtn: document.getElementById('rebirthBtn'),
  };

  const SAVE_KEY = "delma-clicker-v3";

  const state = {
    points: 0,
    perClick: 1,
    autoRate: 0,
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
    rebirths: 0,
    rebirthMultiplier: 1,
    nextRebirthCost: 5000,
  };

  function popMessage(text) {
    el.message.textContent = text;
    setTimeout(() => el.message.textContent = "", 2000);
  }

  function render() {
    const clickMult = (state.booster.active ? state.booster.multiplier : 1) * state.rebirthMultiplier;
    el.points.textContent = Math.floor(state.points);
    el.pointsTop.textContent = Math.floor(state.points);
    el.perClick.textContent = state.perClick * clickMult;
    el.autoRate.textContent = state.autoRate * state.rebirthMultiplier;
    el.upgradeClickCost.textContent = state.costs.upgradeClick;
    el.autoClickCost.textContent = state.costs.autoClick;
    el.boosterCost.textContent = state.costs.booster;
    el.doubleClickCost.textContent = state.costs.doubleClick;
    el.rebirths.textContent = state.rebirths;
    el.rebirthMultiplier.textContent = state.rebirthMultiplier + "x";
    el.nextRebirthCost.textContent = state.nextRebirthCost;
    el.rebirthBtn.disabled = state.points < state.nextRebirthCost;
  }

  function handleClick() {
    const mult = (state.booster.active ? state.booster.multiplier : 1) * state.rebirthMultiplier;
    state.points += state.perClick * mult;
    render();
  }

  function buyClickUpgrade() {
    if (state.points < state.costs.upgradeClick) return popMessage("Za mało punktów!");
    state.points -= state.costs.upgradeClick;
    state.perClick++;
    state.costs.upgradeClick = Math.ceil(state.costs.upgradeClick * 1.25);
    render();
  }

  function buyAutoClick() {
    if (state.points < state.costs.autoClick) return popMessage("Za mało punktów!");
    state.points -= state.costs.autoClick;
    state.autoRate++;
    state.costs.autoClick = Math.ceil(state.costs.autoClick * 1.35);
    render();
  }

  function buyBooster() {
    if (state.points < state.costs.booster) return popMessage("Za mało punktów!");
    state.points -= state.costs.booster;
    state.booster.active = true;
    state.booster.endsAt = Date.now() + 30000;
    state.costs.booster = Math.ceil(state.costs.booster * 1.5);
    popMessage("Booster aktywny! Klik x2 przez 30s!");
    render();
  }

  function buyDoubleClick() {
    if (state.points < state.costs.doubleClick) return popMessage("Za mało punktów!");
    state.points -= state.costs.doubleClick;
    state.perClick *= 2;
    state.costs.doubleClick = Math.ceil(state.costs.doubleClick * 2);
    popMessage("Double Click kupiony!");
    render();
  }

  function doRebirth() {
    if (state.points < state.nextRebirthCost) return popMessage("Za mało punktów!");
    state.rebirths++;
    state.rebirthMultiplier *= 2;
    state.points = 0;
    state.nextRebirthCost = Math.ceil(state.nextRebirthCost * 2);
    popMessage("REBIRTH! Mnożnik x" + state.rebirthMultiplier);
    render();
  }

  function saveGame() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    popMessage("Zapisano grę!");
  }

  function loadGame() {
    const data = localStorage.getItem(SAVE_KEY);
    if (!data) return popMessage("Brak zapisu!");
    const loaded = JSON.parse(data);
    Object.assign(state, loaded);
    popMessage("Wczytano grę!");
    render();
  }

  function resetGame() {
    if (!confirm("Na pewno reset?")) return;
    localStorage.removeItem(SAVE_KEY);
    location.reload();
  }

  function gameLoop() {
    const now = Date.now();
    if (state.booster.active && now >= state.booster.endsAt) {
      state.booster.active = false;
      popMessage("Booster wygasł!");
    }
    state.points += state.autoRate * state.rebirthMultiplier / 10;
    render();
  }

  el.bigButton.addEventListener("click", handleClick);
  el.upgradeClickBtn.addEventListener("click", buyClickUpgrade);
  el.autoClickBtn.addEventListener("click", buyAutoClick);
  el.boosterBtn.addEventListener("click", buyBooster);
  el.doubleClickBtn.addEventListener("click", buyDoubleClick);
  el.rebirthBtn.addEventListener("click", doRebirth);
  el.saveBtn.addEventListener("click", saveGame);
  el.loadBtn.addEventListener("click", loadGame);
  el.resetBtn.addEventListener("click", resetGame);

  setInterval(gameLoop, 100);
  render();
});
