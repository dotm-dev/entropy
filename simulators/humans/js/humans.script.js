// --- Game Config ---
const CONFIG = {
    HOUSE_COST: 150,
    FARM_COST: 200,
    DRAFT_COST: 50,
    SPEC_COST: 200,
    PEASANT_INCOME: 8,
    MILITIA_INCOME: 3,
    FARM_CAPACITY: 150,
    PEASANT_CORN: 5,
    MILITIA_CORN: 10,
    MID_CORN: 30
};

// --- Game State ---
let state = {
    turn: 1,
    silver: 300,
    houses: 1,
    farms: 1,
    peasants: 3,
    militia: 0,
    militiaTraining: 0,
    soldiers: 0,
    soldierTraining: 0,
    logs: ["Game Started. You have 3 Peasants and 1 House."],
    pendingBuildings: []
};

// --- DOM Elements ---
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
    btns: {
        house: document.getElementById('btn-house'),
        farm: document.getElementById('btn-farm'),
        draft: document.getElementById('btn-draft'),
        spec: document.getElementById('btn-spec')
    }
};

// --- Core Logic ---
function updateUI() {
    const cornCapacity = state.farms * CONFIG.FARM_CAPACITY;
    const cornUsage = (state.peasants * CONFIG.PEASANT_CORN) +
        ((state.militia + state.militiaTraining) * CONFIG.MILITIA_CORN) +
        ((state.soldiers + state.soldierTraining) * CONFIG.MID_CORN);
    const availableCorn = cornCapacity - cornUsage;
    const currentIncome = (state.peasants * CONFIG.PEASANT_INCOME) + (state.militia * CONFIG.MILITIA_INCOME);
    const currentPop = state.peasants + state.militia + state.militiaTraining + state.soldiers + state.soldierTraining;
    const totalHousing = state.houses * 5;

    // Updates Text
    els.turn.innerText = state.turn;
    els.silver.innerText = `${state.silver} 🪙`;
    els.income.innerText = `+${currentIncome}/turn`;
    els.corn.innerText = `${cornUsage} / ${cornCapacity} 🌽`;
    els.cornFree.innerText = `${availableCorn} free`;
    els.cornFree.className = `text-xs ${availableCorn > 50 ? 'text-green-400' : 'text-amber-400'}`;
    els.pop.innerText = `${currentPop} / ${totalHousing}`;
    els.houseCount.innerText = `${state.houses} Houses`;

    els.peasants.innerText = state.peasants;
    els.militia.innerHTML = `${state.militia} ${state.militiaTraining > 0 ? `<span class="text-xs text-amber-500">(+${state.militiaTraining})</span>` : ''}`;
    els.soldiers.innerHTML = `${state.soldiers} ${state.soldierTraining > 0 ? `<span class="text-xs text-amber-500">(+${state.soldierTraining})</span>` : ''}`;

    // Buttons State
    els.btns.house.disabled = state.silver < CONFIG.HOUSE_COST;
    els.btns.farm.disabled = state.silver < CONFIG.FARM_COST;
    els.btns.draft.disabled = state.silver < CONFIG.DRAFT_COST || state.peasants === 0 || availableCorn < (CONFIG.MILITIA_CORN - CONFIG.PEASANT_CORN);
    els.btns.spec.disabled = state.silver < CONFIG.SPEC_COST || state.militia === 0 || availableCorn < (CONFIG.MID_CORN - CONFIG.MILITIA_CORN);

    // Render Logs
    els.logs.innerHTML = state.logs.map((log, i) => `
                <div class="text-sm p-2 rounded ${i === 0 ? 'bg-slate-700 text-slate-100 border-l-2 border-amber-500' : 'text-slate-400'}">
                    ${log}
                </div>
            `).join('');
}

const actions = {
    addLog(msg) {
        state.logs = [msg, ...state.logs].slice(0, 15);
    },
    buildHouse() {
        if (state.silver >= CONFIG.HOUSE_COST) {
            state.silver -= CONFIG.HOUSE_COST;
            state.pendingBuildings.push({ type: 'house' });
            this.addLog(`Ordered a House (-${CONFIG.HOUSE_COST}🪙)`);
            updateUI();
        }
    },
    buildFarm() {
        if (state.silver >= CONFIG.FARM_COST) {
            state.silver -= CONFIG.FARM_COST;
            state.pendingBuildings.push({ type: 'farm' });
            this.addLog(`Ordered a Farm (-${CONFIG.FARM_COST}🪙)`);
            updateUI();
        }
    },
    draft() {
        const diff = CONFIG.MILITIA_CORN - CONFIG.PEASANT_CORN;
        if (state.silver >= CONFIG.DRAFT_COST && state.peasants > 0) {
            state.silver -= CONFIG.DRAFT_COST;
            state.peasants--;
            state.militiaTraining++;
            this.addLog(`Drafting 1 Peasant into Militia (-${CONFIG.DRAFT_COST}🪙, 1 turn wait)`);
            updateUI();
        }
    },
    specialize() {
        const diff = CONFIG.MID_CORN - CONFIG.MILITIA_CORN;
        if (state.silver >= CONFIG.SPEC_COST && state.militia > 0) {
            state.silver -= CONFIG.SPEC_COST;
            state.militia--;
            state.soldierTraining++;
            this.addLog(`Training 1 Militia into Soldier (-${CONFIG.SPEC_COST}🪙, 1 turn wait)`);
            updateUI();
        }
    },
    nextTurn() {
        const income = (state.peasants * CONFIG.PEASANT_INCOME) + (state.militia * CONFIG.MILITIA_INCOME);
        state.silver += income;
        state.turn++;

        // Finish training
        state.militia += state.militiaTraining;
        state.soldiers += state.soldierTraining;
        state.militiaTraining = 0;
        state.soldierTraining = 0;

        // Finish Buildings
        state.pendingBuildings.forEach(b => {
            if (b.type === 'house') state.houses++;
            if (b.type === 'farm') state.farms++;
        });
        state.pendingBuildings = [];

        // Population Growth
        let spawnCount = 0;
        const capacity = state.houses * 5;
        const cornMax = state.farms * CONFIG.FARM_CAPACITY;

        for (let i = 0; i < state.houses; i++) {
            const totalUnits = state.peasants + spawnCount + state.militia + state.soldiers;
            const usage = (totalUnits * CONFIG.PEASANT_CORN); // rough check
            if (totalUnits < capacity && (cornMax - usage) >= CONFIG.PEASANT_CORN) {
                spawnCount++;
            }
        }
        state.peasants += spawnCount;

        this.addLog(`Turn ${state.turn} started. Income: +${income}🪙. Spawned ${spawnCount} Peasants.`);
        updateUI();
    },
    reset() {
        state = {
            turn: 1,
            silver: 300,
            houses: 1,
            farms: 1,
            peasants: 3,
            militia: 0,
            militiaTraining: 0,
            soldiers: 0,
            soldierTraining: 0,
            logs: ["Game Reset. You have 3 Peasants and 1 House."],
            pendingBuildings: []
        };
        updateUI();
    }
};

// Init
updateUI();