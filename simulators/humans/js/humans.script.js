let CONFIG = { HOUSE_COST: 150, FARM_COST: 200, DRAFT_COST: 50, SPEC_COST: 200, PEASANT_INCOME: 8, MILITIA_INCOME: 3, FARM_CAPACITY: 150, HOUSE_CAPACITY: 5, PEASANT_CORN: 5, MILITIA_CORN: 10, MID_CORN: 30 };
let startConfig = { silver: 300, houses: 1, farms: 1, peasants: 3 };
let state = {};

const els = {
    turn: document.getElementById('turn-display'),
    silver: document.getElementById('silver-display'),
    silverGhost: document.getElementById('silver-ghost'),
    cardSilver: document.getElementById('card-silver'),
    income: document.getElementById('income-display'),
    corn: document.getElementById('corn-display'),
    cornTrend: document.getElementById('corn-trend'),
    cardCorn: document.getElementById('card-corn'),
    cornFree: document.getElementById('corn-free-display'),
    pop: document.getElementById('pop-display'),
    houseCount: document.getElementById('house-count-display'),
    infraContainer: document.getElementById('infrastructure-container'),
    logs: document.getElementById('log-container'),
    modal: document.getElementById('config-modal'),
    peasantTray: document.getElementById('peasant-tray'),
    militiaTray: document.getElementById('militia-tray'),
    soldierTray: document.getElementById('soldier-tray'),
    pCount: document.getElementById('p-count'),
    mCount: document.getElementById('m-count'),
    sCount: document.getElementById('s-count'),
    btns: { house: document.getElementById('btn-house'), farm: document.getElementById('btn-farm'), draft: document.getElementById('btn-draft'), spec: document.getElementById('btn-spec'), endTurn: document.getElementById('btn-end-turn') },
    inputs: { silver: document.getElementById('init-silver'), houses: document.getElementById('init-houses'), peasants: document.getElementById('init-peasants'), houseCap: document.getElementById('cfg-house-cap'), houseCost: document.getElementById('cfg-house-cost'), farmCost: document.getElementById('cfg-farm-cost'), draftCost: document.getElementById('cfg-draft-cost'), specCost: document.getElementById('cfg-spec-cost'), peasantInc: document.getElementById('cfg-peasant-inc'), militiaInc: document.getElementById('cfg-militia-inc'), farmCap: document.getElementById('cfg-farm-cap'), peasantCorn: document.getElementById('cfg-peasant-corn'), militiaCorn: document.getElementById('cfg-militia-corn'), midCorn: document.getElementById('cfg-mid-corn') }
};

function calculateCurrentUpkeep(p, m, mt, s, st) {
    return (p * CONFIG.PEASANT_CORN) + ((m + mt) * CONFIG.MILITIA_CORN) + ((s + st) * CONFIG.MID_CORN);
}

function updateUI() {
    const cornCapacity = state.farms * CONFIG.FARM_CAPACITY;
    const peasantsCount = state.houseList.reduce((a, b) => a + b, 0);
    const cornUsage = calculateCurrentUpkeep(peasantsCount, state.militia, state.militiaTraining, state.soldiers, state.soldierTraining);
    const availableCorn = cornCapacity - cornUsage;
    const currentIncome = (peasantsCount * CONFIG.PEASANT_INCOME) + (state.militia * CONFIG.MILITIA_INCOME);

    els.turn.innerText = state.turn;
    els.silver.innerText = state.silver;
    els.income.innerText = `+${currentIncome}`;
    els.corn.innerText = `${cornUsage}/${cornCapacity}`;
    els.cornFree.innerText = `${availableCorn} FREE`;
    els.pop.innerText = `${peasantsCount}/${state.houseList.length * CONFIG.HOUSE_CAPACITY}`;

    // Unit Values
    els.pCount.innerText = peasantsCount;
    els.mCount.innerText = state.militia + (state.militiaTraining > 0 ? ` (+${state.militiaTraining})` : '');
    els.sCount.innerText = state.soldiers + (state.soldierTraining > 0 ? ` (+${state.soldierTraining})` : '');

    // Buttons Labels
    document.getElementById('btn-house-label').innerText = `${CONFIG.HOUSE_COST} 🪙`;
    document.getElementById('btn-farm-label').innerText = `${CONFIG.FARM_COST} 🪙`;
    document.getElementById('btn-draft-label').innerText = `${CONFIG.DRAFT_COST} 🪙`;
    document.getElementById('btn-draft-corn').innerText = `${CONFIG.MILITIA_CORN - CONFIG.PEASANT_CORN} 🌽`;
    document.getElementById('btn-spec-label').innerText = `${CONFIG.SPEC_COST} 🪙`;
    document.getElementById('btn-spec-corn').innerText = `${CONFIG.MID_CORN - CONFIG.MILITIA_CORN} 🌽`;

    els.btns.house.disabled = state.silver < CONFIG.HOUSE_COST;
    els.btns.farm.disabled = state.silver < CONFIG.FARM_COST;
    els.btns.draft.disabled = state.silver < CONFIG.DRAFT_COST || peasantsCount === 0 || availableCorn < (CONFIG.MILITIA_CORN - CONFIG.PEASANT_CORN);
    els.btns.spec.disabled = state.silver < CONFIG.SPEC_COST || state.militia === 0 || availableCorn < (CONFIG.MID_CORN - CONFIG.MILITIA_CORN);

    // Tray Icons
    els.peasantTray.innerHTML = Array(peasantsCount).fill('<div class="unit-icon peasant-icon"></div>').join('');
    els.militiaTray.innerHTML = Array(state.militia).fill('<div class="unit-icon militia-icon"></div>').join('') + Array(state.militiaTraining).fill('<div class="unit-icon militia-icon opacity-30 animate-pulse"></div>').join('');
    els.soldierTray.innerHTML = Array(state.soldiers).fill('<div class="unit-icon mid-tier-icon"></div>').join('') + Array(state.soldierTraining).fill('<div class="unit-icon mid-tier-icon opacity-30 animate-pulse"></div>').join('');

    // Layout Grid
    let houseHTML = '';
    state.houseList.forEach((pop, i) => {
        const ratio = pop / CONFIG.HOUSE_CAPACITY;
        const color = ratio >= 1 ? 'bg-rose-500' : ratio >= 0.7 ? 'bg-orange-500' : ratio >= 0.4 ? 'bg-amber-500' : 'bg-emerald-500';
        houseHTML += `<div id="h-${i}" class="bg-slate-950 p-2 rounded-xl border border-slate-800 text-center relative transition-all">
                    <div class="text-[7px] text-slate-500 font-black mb-0.5">H-${i+1}</div>
                    <div class="text-[10px] font-black">${pop}/${CONFIG.HOUSE_CAPACITY}</div>
                    <div class="flex flex-wrap gap-0.5 justify-center mt-1">
                        ${Array(CONFIG.HOUSE_CAPACITY).fill(0).map((_, idx) => `<div class="w-1 h-1 rounded-full ${idx < pop ? color : 'bg-slate-800/50'}"></div>`).join('')}
                    </div>
                </div>`;
    });
    state.pendingBuildings.forEach(b => {
        houseHTML += `<div class="p-2 rounded-xl border border-dashed border-amber-900/30 bg-amber-950/5 text-center opacity-40 construction-grid">
                    <div class="text-[7px] font-black text-amber-600 uppercase">${b.type}</div>
                    <div class="text-[9px] font-black">ORDER</div>
                </div>`;
    });
    for(let i=0; i<state.farms; i++) {
        houseHTML += `<div class="p-2 bg-amber-950/5 rounded-xl border border-amber-900/10 text-center">
                    <div class="text-[7px] text-amber-700 font-black mb-0.5">F-${i+1}</div>
                    <div class="text-[9px] text-amber-500 font-black">+${CONFIG.FARM_CAPACITY}</div>
                </div>`;
    }
    els.infraContainer.innerHTML = houseHTML;

    els.logs.innerHTML = state.logs.map((log, i) => `<div class="${i === 0 ? 'text-indigo-400 font-bold border-l-2 border-indigo-600 pl-2' : 'text-slate-500 pl-2'} py-0.5"> ${log}</div>`).join('');
}

const actions = {
    toggleConfig() { els.modal.classList.toggle('active'); },
    switchTab(tab) {
        ['resources', 'params'].forEach(t => {
            const btn = document.getElementById(`tab-btn-${t}`);
            const cnt = document.getElementById(`tab-${t}`);
            btn.classList.toggle('active-tab-btn', t === tab);
            cnt.classList.toggle('active', t === tab);
        });
    },
    changeValue(id, delta) { document.getElementById(id).value = Math.max(0, (parseInt(document.getElementById(id).value) || 0) + delta); },
    preview(resource, delta) {
        if (resource === 'silver') {
            els.silverGhost.innerText = `(${delta > 0 ? '+' : ''}${delta})`;
            els.silverGhost.style.color = delta > 0 ? '#10b981' : '#f43f5e';
        }
    },
    clearPreview() { els.silverGhost.innerText = ''; },
    addLog(msg) { state.logs = [msg, ...state.logs].slice(0, 40); },
    buildHouse() { if (state.silver >= CONFIG.HOUSE_COST) { state.silver -= CONFIG.HOUSE_COST; state.pendingBuildings.push({ type: 'house' }); this.addLog(`📜 Turn ${state.turn}: Edict issued for new Homestead.`); updateUI(); } },
    buildFarm() { if (state.silver >= CONFIG.FARM_COST) { state.silver -= CONFIG.FARM_COST; state.pendingBuildings.push({ type: 'farm' }); this.addLog(`📜 Turn ${state.turn}: Construction of new Farm began.`); updateUI(); } },
    draft() {
        if (state.silver >= CONFIG.DRAFT_COST) {
            state.silver -= CONFIG.DRAFT_COST;
            for (let i = 0; i < state.houseList.length; i++) { if (state.houseList[i] > 0) { state.houseList[i]--; break; } }
            state.militiaTraining++; this.addLog(`⚔️ Turn ${state.turn}: Peasant conscripted for militia service.`); updateUI();
        }
    },
    specialize() { if (state.silver >= CONFIG.SPEC_COST && state.militia > 0) { state.silver -= CONFIG.SPEC_COST; state.militia--; state.soldierTraining++; this.addLog(`🛡️ Turn ${state.turn}: Specialized training authorized.`); updateUI(); } },
    nextTurn() {
        els.btns.endTurn.disabled = true;
        setTimeout(() => {
            const peasants = state.houseList.reduce((a, b) => a + b, 0);
            const income = (peasants * CONFIG.PEASANT_INCOME) + (state.militia * CONFIG.MILITIA_INCOME);
            state.silver += income;
            const recHouses = state.houseList.length;

            state.militia += state.militiaTraining; state.soldiers += state.soldierTraining;
            state.militiaTraining = 0; state.soldierTraining = 0;

            state.pendingBuildings.forEach(b => { if (b.type === 'house') state.houseList.push(0); if (b.type === 'farm') state.farms++; });
            state.pendingBuildings = [];

            let spawnCount = 0;
            const cornLimit = state.farms * CONFIG.FARM_CAPACITY;
            for (let i = 0; i < recHouses; i++) {
                if (state.houseList[i] < CONFIG.HOUSE_CAPACITY) {
                    const curTotalPeasants = state.houseList.reduce((a,b)=>a+b,0);
                    const curUse = calculateCurrentUpkeep(curTotalPeasants, state.militia, 0, state.soldiers, 0);
                    if ((cornLimit - curUse) >= CONFIG.PEASANT_CORN) {
                        state.houseList[i]++; spawnCount++; this.triggerBirthAnim(i);
                    }
                }
            }
            state.turn++;
            this.addLog(`🌞 Turn ${state.turn}: Revenue collected. ${spawnCount} new Peasants arrived.`);
            els.btns.endTurn.disabled = false;
            updateUI();
        }, 200);
    },
    triggerBirthAnim(idx) {
        const el = document.getElementById(`h-${idx}`); if (!el) return;
        const rect = el.getBoundingClientRect();
        const div = document.createElement('div'); div.className = 'birth-bubble';
        div.innerText = '+1'; div.style.left = `${rect.left + rect.width/2}px`; div.style.top = `${rect.top}px`;
        document.body.appendChild(div); setTimeout(() => div.remove(), 1500);
    },
    applyAndRestart() {
        startConfig.silver = parseInt(els.inputs.silver.value);
        startConfig.houses = parseInt(els.inputs.houses.value);
        startConfig.peasants = parseInt(els.inputs.peasants.value);
        CONFIG.HOUSE_CAPACITY = parseInt(els.inputs.houseCap.value);
        CONFIG.HOUSE_COST = parseInt(els.inputs.houseCost.value);
        CONFIG.FARM_COST = parseInt(els.inputs.farmCost.value);
        CONFIG.DRAFT_COST = parseInt(els.inputs.draftCost.value);
        CONFIG.SPEC_COST = parseInt(els.inputs.specCost.value);
        CONFIG.PEASANT_INCOME = parseInt(els.inputs.peasantInc.value);
        CONFIG.MILITIA_INCOME = parseInt(els.inputs.militiaInc.value);
        CONFIG.FARM_CAPACITY = parseInt(els.inputs.farmCap.value);
        CONFIG.PEASANT_CORN = parseInt(els.inputs.peasantCorn.value);
        CONFIG.MILITIA_CORN = parseInt(els.inputs.militiaCorn.value);
        CONFIG.MID_CORN = parseInt(els.inputs.midCorn.value);
        this.reset(); this.toggleConfig();
    },
    reset() {
        const houses = []; let pRem = startConfig.peasants;
        for (let i = 0; i < startConfig.houses; i++) { const c = Math.min(pRem, CONFIG.HOUSE_CAPACITY); houses.push(c); pRem -= c; }
        state = { turn: 1, silver: startConfig.silver, houseList: houses, farms: startConfig.farms, peasants: houses.reduce((a,b)=>a+b,0), militia: 0, militiaTraining: 0, soldiers: 0, soldierTraining: 0, logs: [`Command center initialized. Awaiting orders.`], pendingBuildings: [] };
        updateUI();
    }
};
actions.reset();