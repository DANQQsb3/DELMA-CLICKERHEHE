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
    state.points -= state.costs.autoClick
