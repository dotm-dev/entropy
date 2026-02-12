// Global Game Configuration
let CONFIG = {
    HOUSE_COST: 150,
    FARM_COST: 200,
    DRAFT_COST: 50,
    SPEC_COST: 200,
    PEASANT_INCOME: 8,
    MILITIA_INCOME: 3,
    FARM_CAPACITY: 150,
    HOUSE_CAPACITY: 5,
    PEASANT_CORN: 5,
    MILITIA_CORN: 10,
    MID_CORN: 30
};

let startConfig = {
    silver: 300,
    houses: 1,
    farms: 1,
    peasants: 3
};

let state = {};

const els = {
    turn: document.getElementById('turn-display'),
    silver: document.getElementById('silver-display'),
    income: document.getElementById('income-display'),
    corn: document.getElementById('corn-display'),
    cornFree: document.getElementById('corn-free-display'),
    pop: document.getElementById('pop-display'),
    houseCount: document.getElementById('house-count-display'),
    logs: document.getElementById('log-container'),
    peasants: document.getElementById('peasant-count'),
    militia: document.getElementById('militia-count'),
    soldiers: document.getElementById('soldier-count'),
    modal: document.getElementById('config-modal'),
    infraContainer: document.getElementById('infrastructure-container'),
    btns: {
        house: document.getElementById('btn-house'),
        farm: document.getElementById('btn-farm'),
        draft: document.getElementById('btn-draft'),
        spec: document.getElementById('btn-spec')
    },
    btnLabels: {
        house: document.getElementById('btn-house-label'),
        farm: document.getElementById('btn-farm-label'),
        draft: document.getElementById('btn-draft-label'),
        draftCorn: document.getElementById('btn-draft-corn'),
        spec: document.getElementById('btn-spec-label'),
        specCorn: document.getElementById('btn-spec-corn')
    },
    inputs: {
        silver: document.getElementById('init-silver'),
        houses: document.getElementById('init-houses'),
        farms: document.getElementById('init-farms'),
        peasants: document.getElementById('init-peasants'),
        houseCost: document.getElementById('cfg-house-cost'),
        farmCost: document.getElementById('cfg-farm-cost'),
        draftCost: document.getElementById('cfg-draft-cost'),
        specCost: document.getElementById('cfg-spec-cost'),
        peasantInc: document.getElementById('cfg-peasant-inc'),
        militiaInc: document.getElementById('cfg-militia-inc'),
        farmCap: document.getElementById('cfg-farm-cap'),
        houseCap: document.getElementById('cfg-house-cap'),
        peasantCorn: document.getElementById('cfg-peasant-corn'),
        militiaCorn: document.getElementById('cfg-militia-corn'),
        midCorn: document.getElementById('cfg-mid-corn')
    }
};

function calculateCurrentUpkeep(p, m, mt, s, st) {
    return (p * CONFIG.PEASANT_CORN) +
        ((m + mt) * CONFIG.MILITIA_CORN) +
        ((s + st) * CONFIG.MID_CORN);
}

function updateUI() {
    const cornCapacity = state.farms * CONFIG.FARM_CAPACITY;
    state.peasants = state.houseList.reduce((a, b) => a + b, 0);

    const cornUsage = calculateCurrentUpkeep(
        state.peasants,
        state.militia, state.militiaTraining,
        state.soldiers, state.soldierTraining
    );
    const availableCorn = cornCapacity - cornUsage;
    const currentIncome = (state.peasants * CONFIG.PEASANT_INCOME) + (state.militia * CONFIG.MILITIA_INCOME);

    // Fix: currentPop for housing card ONLY includes peasants
    const housedPop = state.peasants;
    const totalHousing = state.houseList.length * CONFIG.HOUSE_CAPACITY;

    els.turn.innerText = state.turn;
    els.silver.innerText = `${state.silver} 🪙`;
    els.income.innerText = `+${currentIncome}`;
    els.corn.innerText = `${cornUsage} / ${cornCapacity}`;
    els.cornFree.innerText = availableCorn;
    els.cornFree.className = `text-xs font-bold ${availableCorn >= Math.max(CONFIG.PEASANT_CORN, 5) ? 'text-green-400' : 'text-amber-400'}`;
    els.pop.innerText = `${housedPop} / ${totalHousing}`;
    els.houseCount.innerText = `${state.houseList.length} House${state.houseList.length !== 1 ? 's' : ''}`;

    els.peasants.innerText = state.peasants;
    els.militia.innerHTML = `${state.militia} ${state.militiaTraining > 0 ? `<span class="text-[10px] text-amber-500">(+${state.militiaTraining})</span>` : ''}`;
    els.soldiers.innerHTML = `${state.soldiers} ${state.soldierTraining > 0 ? `<span class="text-[10px] text-blue-400">(+${state.soldierTraining})</span>` : ''}`;

    els.btnLabels.house.innerText = `${CONFIG.HOUSE_COST} 🪙`;
    els.btnLabels.farm.innerText = `${CONFIG.FARM_COST} 🪙`;
    els.btnLabels.draft.innerText = `${CONFIG.DRAFT_COST} 🪙`;
    els.btnLabels.draftCorn.innerText = `${CONFIG.MILITIA_CORN - CONFIG.PEASANT_CORN} 🌽`;
    els.btnLabels.spec.innerText = `${CONFIG.SPEC_COST} 🪙`;
    els.btnLabels.specCorn.innerText = `${CONFIG.MID_CORN - CONFIG.MILITIA_CORN} 🌽`;

    els.btns.house.disabled = state.silver < CONFIG.HOUSE_COST;
    els.btns.farm.disabled = state.silver < CONFIG.FARM_COST;
    els.btns.draft.disabled = state.silver < CONFIG.DRAFT_COST || state.peasants === 0 || availableCorn < (CONFIG.MILITIA_CORN - CONFIG.PEASANT_CORN);
    els.btns.spec.disabled = state.silver < CONFIG.SPEC_COST || state.militia === 0 || availableCorn < (CONFIG.MID_CORN - CONFIG.MILITIA_CORN);

    let houseHTML = '';
    state.houseList.forEach((pop, i) => {
        let isFull = pop >= CONFIG.HOUSE_CAPACITY;
        houseHTML += `
                    <div class="bg-slate-900 p-2 rounded-lg border ${isFull ? 'border-slate-700 opacity-60' : 'border-indigo-500/30'} text-center">
                        <div class="text-[7px] uppercase text-slate-500 font-bold mb-0.5 tracking-tighter">H-${i + 1}</div>
                        <div class="text-[10px] font-black ${isFull ? 'text-slate-400' : 'text-indigo-300'}">${pop}/${CONFIG.HOUSE_CAPACITY}</div>
                        <div class="flex flex-wrap gap-0.5 justify-center mt-1">
                            ${Array(CONFIG.HOUSE_CAPACITY).fill(0).map((_, idx) => `
                                <div class="w-1 h-1 rounded-full ${idx < pop ? 'bg-indigo-500' : 'bg-slate-800'}"></div>
                            `).join('')}
                        </div>
                    </div>
                `;
    });

    for (let i = 0; i < state.farms; i++) {
        houseHTML += `
                    <div class="bg-slate-900 p-2 rounded-lg border border-yellow-500/20 text-center">
                        <div class="text-[7px] uppercase text-slate-500 font-bold mb-0.5 tracking-tighter">F-${i + 1}</div>
                        <div class="text-[9px] font-black text-yellow-200">+${CONFIG.FARM_CAPACITY}</div>
                    </div>
                `;
    }
    els.infraContainer.innerHTML = houseHTML || `<p class="col-span-full text-slate-600 italic text-center py-4 text-[10px]">No buildings.</p>`;

    els.logs.innerHTML = state.logs.map((log, i) => `
                <div class="text-[10px] leading-snug p-2 rounded ${i === 0 ? 'bg-slate-700 text-slate-100 border-l-2 border-indigo-500' : 'text-slate-400'}">
                    ${log}
                </div>
            `).join('');
}

const actions = {
    toggleConfig() { els.modal.classList.toggle('active'); },
    switchTab(tab) {
        ['resources', 'params'].forEach(t => {
            document.getElementById(`tab-btn-${t}`).classList.toggle('border-indigo-500', t === tab);
            document.getElementById(`tab-btn-${t}`).classList.toggle('text-indigo-400', t === tab);
            document.getElementById(`tab-btn-${t}`).classList.toggle('border-transparent', t !== tab);
            document.getElementById(`tab-btn-${t}`).classList.toggle('text-slate-500', t !== tab);
            document.getElementById(`tab-${t}`).classList.toggle('active', t === tab);
        });
    },
    changeValue(id, delta) {
        const input = document.getElementById(id);
        input.value = Math.max(0, (parseInt(input.value) || 0) + delta);
    },
    addLog(msg) { state.logs = [msg, ...state.logs].slice(0, 50); },
    buildHouse() {
        if (state.silver >= CONFIG.HOUSE_COST) {
            state.silver -= CONFIG.HOUSE_COST;
            state.pendingBuildings.push({ type: 'house' });
            this.addLog(`🏗️ Order: New House.`);
            updateUI();
        }
    },
    buildFarm() {
        if (state.silver >= CONFIG.FARM_COST) {
            state.silver -= CONFIG.FARM_COST;
            state.pendingBuildings.push({ type: 'farm' });
            this.addLog(`🌾 Order: New Farm.`);
            updateUI();
        }
    },
    draft() {
        if (state.silver >= CONFIG.DRAFT_COST && state.peasants > 0) {
            state.silver -= CONFIG.DRAFT_COST;
            for (let i = 0; i < state.houseList.length; i++) {
                if (state.houseList[i] > 0) { state.houseList[i]--; break; }
            }
            state.militiaTraining++;
            this.addLog(`⚔️ The Draft: 1 Peasant becomes Militia.`);
            updateUI();
        }
    },
    specialize() {
        if (state.silver >= CONFIG.SPEC_COST && state.militia > 0) {
            state.silver -= CONFIG.SPEC_COST;
            state.militia--;
            state.soldierTraining++;
            this.addLog(`🛡️ Training: 1 Militia becomes Soldier.`);
            updateUI();
        }
    },
    nextTurn() {
        const currentPeasants = state.houseList.reduce((a, b) => a + b, 0);
        const income = (currentPeasants * CONFIG.PEASANT_INCOME) + (state.militia * CONFIG.MILITIA_INCOME);
        state.silver += income;
        const recruitingHousesCount = state.houseList.length;
        state.militia += state.militiaTraining;
        state.soldiers += state.soldierTraining;
        state.militiaTraining = 0;
        state.soldierTraining = 0;
        state.pendingBuildings.forEach(b => {
            if (b.type === 'house') state.houseList.push(0);
            if (b.type === 'farm') state.farms++;
        });
        state.pendingBuildings = [];
        let spawnCount = 0;
        const cornLimit = state.farms * CONFIG.FARM_CAPACITY;
        for (let i = 0; i < recruitingHousesCount; i++) {
            if (state.houseList[i] < CONFIG.HOUSE_CAPACITY) {
                const totalPeasantsAtMoment = state.houseList.reduce((a, b) => a + b, 0);
                const currentUsage = calculateCurrentUpkeep(totalPeasantsAtMoment, state.militia, 0, state.soldiers, 0);
                if ((cornLimit - currentUsage) >= CONFIG.PEASANT_CORN) {
                    state.houseList[i]++;
                    spawnCount++;
                }
            }
        }
        state.turn++;
        this.addLog(`🌞 Turn ${state.turn}: Revenue +${income}🪙, Births: ${spawnCount}.`);
        updateUI();
    },
    applyAndRestart() {
        startConfig.silver = parseInt(els.inputs.silver.value) || 0;
        startConfig.houses = parseInt(els.inputs.houses.value) || 0;
        startConfig.farms = parseInt(els.inputs.farms.value) || 0;
        startConfig.peasants = parseInt(els.inputs.peasants.value) || 0;
        CONFIG.HOUSE_COST = parseInt(els.inputs.houseCost.value) || 0;
        CONFIG.FARM_COST = parseInt(els.inputs.farmCost.value) || 0;
        CONFIG.DRAFT_COST = parseInt(els.inputs.draftCost.value) || 0;
        CONFIG.SPEC_COST = parseInt(els.inputs.specCost.value) || 0;
        CONFIG.PEASANT_INCOME = parseInt(els.inputs.peasantInc.value) || 0;
        CONFIG.MILITIA_INCOME = parseInt(els.inputs.militiaInc.value) || 0;
        CONFIG.FARM_CAPACITY = parseInt(els.inputs.farmCap.value) || 0;
        CONFIG.HOUSE_CAPACITY = parseInt(els.inputs.houseCap.value) || 5;
        CONFIG.PEASANT_CORN = parseInt(els.inputs.peasantCorn.value) || 0;
        CONFIG.MILITIA_CORN = parseInt(els.inputs.militiaCorn.value) || 0;
        CONFIG.MID_CORN = parseInt(els.inputs.midCorn.value) || 0;
        this.reset();
        this.toggleConfig();
    },
    reset() {
        const houses = [];
        let pRemaining = startConfig.peasants;
        for (let i = 0; i < startConfig.houses; i++) {
            const count = Math.min(pRemaining, CONFIG.HOUSE_CAPACITY);
            houses.push(count);
            pRemaining -= count;
        }
        state = {
            turn: 1, silver: startConfig.silver, houseList: houses, farms: startConfig.farms,
            peasants: houses.reduce((a,b)=>a+b,0), militia: 0, militiaTraining: 0, soldiers: 0, soldierTraining: 0,
            logs: [`Sim Re-initialized.`], pendingBuildings: []
        };
        updateUI();
    }
};
actions.reset();