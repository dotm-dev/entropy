const config = {
    maxPopWeight: 30,
    spawnIntensities: { low: 0.3, normal: 0.6, high: 0.9 }
};

const icons = {
    atk: `<svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/></svg>`,
    hp: `<svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>`,
    skeleton: `<svg class="unit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z"/></svg>`,
    ghoul: `<svg class="unit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></svg>`,
    knight: `<svg class="unit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>`,
    abomination: `<svg class="unit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.4 15.63a7.875 6 135 1 1 6.23-6.23 4.5 3.43 135 0 0-6.23 6.23"/><path d="m8.29 12.71-2.6 2.6a2.5 2.5 0 1 0-1.65 4.65A2.5 2.5 0 1 0 8.7 18.3l2.59-2.59"/></svg>`,
    lich: `<svg class="unit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.5 17-.5-1-.5 1h1z"/><path d="M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="12" r="1"/></svg>`,
    holy_peasant: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    holy_footman: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/></svg>`,
    holy_knight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="m13 19 6-6"/></svg>`,
    holy_paladin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h12l-2 18H8L6 3z"/><path d="M12 7v8M9 10h6"/></svg>`
};

const unitTypes = {
    'Restless Skeleton': { name: 'Restless Skeleton', hp: 2, maxHp: 2, atk: 1, weight: 1, icon: icons.skeleton, row: 'Skeleton', buildTime: 0, color: 'var(--color-skeleton)' },
    'Ghoul': { name: 'Ghoul', hp: 3, maxHp: 3, atk: 2, weight: 2, icon: icons.ghoul, row: 'Ghoul', buildTime: 1, color: 'var(--color-ghoul)', recipe: {'Restless Skeleton': 3} },
    'Skeleton Knight': { name: 'Skeleton Knight', hp: 8, maxHp: 8, atk: 6, weight: 3, icon: icons.knight, row: 'Knight', buildTime: 1, color: 'var(--color-knight)', recipe: {'Restless Skeleton': 5} },
    'Abomination': { name: 'Abomination', hp: 25, maxHp: 25, atk: 4, weight: 5, icon: icons.abomination, row: 'Abomination', buildTime: 2, color: 'var(--color-abom)', recipe: {'Restless Skeleton': 10} },
    'The Lich': { name: 'The Lich', hp: 30, maxHp: 30, atk: 12, weight: 6, icon: icons.lich, row: 'Lich', buildTime: 2, color: 'var(--color-lich)', recipe: {'Restless Skeleton': 5, 'Ghoul': 1, 'Skeleton Knight': 1} }
};

const enemyUnitTypes = {
    'Peasant': { name: 'Peasant', hp: 2, maxHp: 2, atk: 1, icon: icons.holy_peasant },
    'Footman': { name: 'Footman', hp: 6, maxHp: 6, atk: 2, icon: icons.holy_footman },
    'Knight': { name: 'Knight', hp: 15, maxHp: 15, atk: 4, icon: icons.holy_knight },
    'Paladin': { name: 'Paladin', hp: 30, maxHp: 30, atk: 8, icon: icons.holy_paladin }
};

let state = {
    turn: 1, isProcessing: false, damageBill: 0, intensity: 'normal', weight: 0,
    units: [{ id: 1, ...unitTypes['Restless Skeleton'], turnsRemaining: 0 }],
    enemy: null, gameOver: false
};

function log(msg, color = 'text-slate-500') {
    const entry = document.createElement('div');
    entry.className = color;
    entry.innerText = `> ${msg}`;
    const container = document.getElementById('game-logs');
    container.appendChild(entry);
    container.scrollTop = container.scrollHeight;
}

function calculateDecayDmg(weight) {
    const percent = (weight / config.maxPopWeight) * 100;
    if (percent >= 100) return 5;
    if (percent >= 80) return 3;
    if (percent >= 50) return 1;
    return 0;
}

function calculateNextSpawnCount() {
    const s = config.spawnIntensities[state.intensity];
    const x = state.weight; // activeWeight
    const k = config.maxPopWeight;
    if (x === 0) return 0;
    return Math.max(1, Math.floor(s * x * (1 - x / k)));
}

function getTinyIcon(ico, color) {
    return ico.replace('unit-icon', 'tiny-icon').replace('stat-icon', 'tiny-icon').replace('currentColor', color || 'currentColor');
}

function render() {
    if (state.gameOver) {
        document.getElementById('game-over-screen').style.display = 'flex';
        document.getElementById('stat-cycles').innerText = state.turn;
        return;
    } else { document.getElementById('game-over-screen').style.display = 'none'; }

    document.getElementById('banner-atk-icon').innerHTML = icons.atk.replace('stat-icon', 'stat-icon w-6 h-6 opacity-40');
    document.getElementById('banner-hp-icon').innerHTML = icons.hp.replace('stat-icon', 'stat-icon w-6 h-6 text-green-900');
    document.getElementById('enemy-atk-icon').innerHTML = icons.atk.replace('stat-icon', 'stat-icon text-red-500');
    document.getElementById('enemy-hp-icon').innerHTML = icons.hp.replace('stat-icon', 'stat-icon text-red-500');

    document.getElementById('turn-count').innerText = state.turn;
    const bannerCtx = document.getElementById('banner-context');
    const endBtnText = document.getElementById('btn-end-text');
    const endBtn = document.getElementById('btn-end-turn');

    ['low', 'normal', 'high'].forEach(l => {
        const el = document.getElementById('pill-' + l);
        if (el) el.className = 'intensity-pill ' + (state.intensity === l ? 'active' : '');
    });

    if (state.isProcessing) {
        bannerCtx.innerText = "Processing Rituals...";
        bannerCtx.classList.remove('hidden');
        endBtnText.innerText = "PROCESSING...";
        endBtn.disabled = true;
    } else if (state.damageBill > 0) {
        bannerCtx.innerText = `ALLOCATION: ${state.damageBill} DMG UNASSIGNED`;
        bannerCtx.classList.remove('hidden');
        bannerCtx.style.color = "var(--blood-red)";
        endBtnText.innerText = "ALLOCATE DAMAGE";
        endBtn.classList.add('btn-pay');
        endBtn.disabled = true;
    } else if (state.enemy) {
        bannerCtx.innerText = "CONFLICT ACTIVE";
        bannerCtx.classList.remove('hidden');
        bannerCtx.style.color = "var(--blood-red)";
        endBtnText.innerText = "INITIATE CLASH";
        endBtn.classList.remove('btn-pay');
        endBtn.disabled = false;
    } else {
        bannerCtx.classList.add('hidden');
        endBtnText.innerText = "END TURN";
        endBtn.classList.remove('btn-pay');
        endBtn.disabled = false;
    }

    const activeWeight = state.units.reduce((sum, u) => sum + (u.turnsRemaining === 0 ? u.weight : 0), 0);
    const stasisWeight = state.units.reduce((sum, u) => sum + (u.turnsRemaining > 0 ? u.weight : 0), 0);
    state.weight = activeWeight;

    const activeUnits = state.units.filter(u => u.turnsRemaining === 0);
    const totalAtk = activeUnits.reduce((sum, u) => sum + u.atk, 0);
    const totalHp = activeUnits.reduce((sum, u) => sum + u.hp, 0);

    document.getElementById('pop-weight-text').innerText = `${activeWeight} / ${config.maxPopWeight}`;
    const weightPercent = (activeWeight / config.maxPopWeight) * 100;
    const stasisPercent = ((activeWeight + stasisWeight) / config.maxPopWeight) * 100;
    const nextSpawn = calculateNextSpawnCount();
    const predPercent = ((activeWeight + stasisWeight + nextSpawn) / config.maxPopWeight) * 100;

    document.getElementById('pop-bar').style.width = `${Math.min(100, weightPercent)}%`;
    document.getElementById('pop-bar-stasis').style.width = `${Math.min(100, stasisPercent)}%`;
    document.getElementById('pop-bar-predict').style.width = `${Math.min(100, predPercent)}%`;
    document.getElementById('pop-bar').style.backgroundColor = activeWeight > 80 ? '#ef4444' : activeWeight > 50 ? '#f59e0b' : '#4ade80';

    document.getElementById('total-atk').innerText = totalAtk;
    document.getElementById('total-hp').innerText = Math.ceil(totalHp);

    const decayPerUnit = calculateDecayDmg(activeWeight);
    document.getElementById('forecast-decay').innerText = decayPerUnit;
    document.getElementById('forecast-spawn').innerText = `+${nextSpawn}`;

    ['Lich', 'Abomination', 'Knight', 'Ghoul', 'Skeleton'].forEach(row => document.getElementById(`row-${row}`).innerHTML = '');
    state.units.forEach(u => {
        const sprite = document.createElement('div');
        const isBuilding = u.turnsRemaining > 0;
        sprite.className = `unit-sprite has-tooltip ${isBuilding ? 'building' : (state.damageBill > 0 ? 'clickable' : '')}`;

        sprite.onclick = () => {
            if (state.damageBill > 0 && !isBuilding) {
                payBill(u.id);
            } else if (isBuilding) {
                cancelRitual(u.id);
            }
        };

        const hpPercent = (u.hp / u.maxHp) * 100;
        sprite.innerHTML = `
                    <div class="mb-1" style="color: ${u.color}">${u.icon}</div>
                    <div class="sprite-stats">
                        <div class="sprite-stat-item" style="color: rgba(255,255,255,0.4)">${getTinyIcon(icons.atk, 'rgba(255,255,255,0.4)')}<span style="color: #fff">${u.atk}</span></div>
                        <div class="sprite-stat-item" style="color: #064e3b">${getTinyIcon(icons.hp, '#064e3b')}<span style="color: var(--necrotic-green)">${u.hp}</span></div>
                    </div>
                    ${isBuilding ? `<div class="stasis-timer">${u.turnsRemaining}T</div>` : ''}
                    <div class="hp-bar-bg"><div class="hp-bar-fill" style="width: ${hpPercent}%; background: ${u.color}"></div></div>
                    <div class="tooltip">
                        <div class="tooltip-title" style="color: ${u.color}">${u.name}</div>
                        <div class="tooltip-stat">
                            <span class="tooltip-label">${getTinyIcon(icons.atk, u.color)} Attack</span>
                            <span class="tooltip-value" style="color: ${u.color}">${u.atk}</span>
                        </div>
                        <div class="tooltip-stat">
                            <span class="tooltip-label">${getTinyIcon(icons.hp, u.color)} Health</span>
                            <span class="tooltip-value" style="color: ${u.color}">${u.hp}/${u.maxHp}</span>
                        </div>
                        <div class="tooltip-stat">
                            <span class="tooltip-label">Weight:</span>
                            <span class="tooltip-value">${u.weight}</span>
                        </div>
                        ${isBuilding ? `<div class="text-[9px] text-purple-400 mt-2 font-black uppercase text-center border-t border-white/10 pt-2 font-sans">Click to Cancel</div>` : ''}
                    </div>
                `;
        document.getElementById(`row-${u.row}`).appendChild(sprite);
    });

    // Ritual Altar Previews and Styled Costs
    const buildBtn = (id, type, name, costs, color) => {
        const prev = document.getElementById('icon-'+type+'-get');
        const label = document.getElementById('label-'+type+'-need');

        prev.innerHTML = icons[type === 'abom' ? 'abomination' : type].replace('unit-icon', 'merge-preview-icon');
        prev.style.color = color;

        let costStr = '';
        costs.forEach(c => {
            costStr += `<div class="cost-row">${c.count}x ${getTinyIcon(icons[c.icon], c.color || 'var(--color-skeleton)')}</div>`;
        });
        label.innerHTML = `<div class="flex flex-row flex-wrap gap-1.5 mt-1 justify-center w-full">${costStr}</div>`;

        const u = unitTypes[name];
        document.getElementById(`tooltip-merge-${id.split('-')[1]}`).innerHTML = `
                    <div class="tooltip-title" style="color: ${color}">${u.name}</div>
                    <div class="tooltip-stat"><span class="tooltip-label">${getTinyIcon(icons.atk, color)} Attack</span><span class="tooltip-value">${u.atk}</span></div>
                    <div class="tooltip-stat"><span class="tooltip-label">${getTinyIcon(icons.hp, color)} Health</span><span class="tooltip-value">${u.maxHp}</span></div>
                    <div class="tooltip-stat"><span class="tooltip-label">Ritual Time:</span><span class="tooltip-value">${u.buildTime}T</span></div>
                `;
    };

    buildBtn('merge-Ghoul', 'ghoul', 'Ghoul', [{count: 3, icon: 'skeleton'}], 'var(--color-ghoul)');
    buildBtn('merge-Knight', 'knight', 'Skeleton Knight', [{count: 5, icon: 'skeleton'}], 'var(--color-knight)');
    buildBtn('merge-Abomination', 'abom', 'Abomination', [{count: 10, icon: 'skeleton'}], 'var(--color-abom)');
    buildBtn('merge-Lich', 'lich', 'The Lich', [
        {count: 5, icon: 'skeleton'},
        {count: 1, icon: 'ghoul', color: 'var(--color-ghoul)'},
        {count: 1, icon: 'knight', color: 'var(--color-knight)'}
    ], 'var(--color-lich)');

    const activeVessels = state.units.filter(u => u.turnsRemaining === 0);
    const check = (n) => activeVessels.filter(v => v.name === n).length;
    document.getElementById('merge-Ghoul').disabled = state.isProcessing || check('Restless Skeleton') < 3;
    document.getElementById('merge-Knight').disabled = state.isProcessing || check('Restless Skeleton') < 5;
    document.getElementById('merge-Abomination').disabled = state.isProcessing || check('Restless Skeleton') < 10;
    document.getElementById('merge-Lich').disabled = state.isProcessing || (check('Restless Skeleton') < 5 || check('Ghoul') < 1 || check('Skeleton Knight') < 1);

    document.getElementById('btn-scout').disabled = state.isProcessing || !!state.enemy || state.damageBill > 0;
    document.getElementById('enemy-area').style.display = state.enemy ? 'block' : 'none';

    if (state.enemy) {
        const enemyAtkTotal = state.enemy.units.reduce((sum, u) => sum + u.atk, 0);
        const enemyHpTotal = state.enemy.units.reduce((sum, u) => sum + u.hp, 0);
        document.getElementById('enemy-hp').innerText = enemyHpTotal;
        document.getElementById('enemy-atk').innerText = enemyAtkTotal;
        const enemyList = document.getElementById('enemy-units-list');
        enemyList.innerHTML = '';
        state.enemy.units.forEach(u => {
            const mini = document.createElement('div');
            mini.className = 'enemy-unit-mini';
            mini.innerHTML = `${u.icon}<div class="enemy-mini-hp font-mono">${u.hp}</div>`;
            enemyList.appendChild(mini);
        });
    }
}

function setIntensity(lvl) { state.intensity = lvl; render(); }

function payBill(unitId) {
    if (state.damageBill <= 0) return;
    const idx = state.units.findIndex(u => u.id === unitId && u.turnsRemaining === 0);
    if (idx === -1) return;
    state.units[idx].hp -= 1;
    state.damageBill -= 1;
    if (state.units[idx].hp <= 0) { log(`Vessel extinguished in allocation.`, 'text-red-500'); state.units.splice(idx, 1); }
    if (state.units.length === 0) state.gameOver = true;
    render();
}

function cancelRitual(unitId) {
    const idx = state.units.findIndex(u => u.id === unitId);
    if (idx === -1 || state.units[idx].turnsRemaining === 0) return;

    const unit = state.units[idx];
    const recipe = unit.recipe;

    for (const [typeName, count] of Object.entries(recipe)) {
        for (let i = 0; i < count; i++) {
            state.units.push({ ...unitTypes[typeName], id: Math.random() + Date.now(), turnsRemaining: 0 });
        }
    }

    log(`${unit.name.toUpperCase()} ritual collapsed. Vessels returned.`, 'text-purple-400');
    state.units.splice(idx, 1);
    render();
}

function mergeUnit(type) {
    const template = unitTypes[type === 'Knight' ? 'Skeleton Knight' : (type === 'Lich' ? 'The Lich' : type)];
    const activeOnlyRemover = (n, c) => {
        for(let i=0; i<c; i++){
            const idx = state.units.findIndex(u => u.name === n && u.turnsRemaining === 0);
            if(idx > -1) state.units.splice(idx, 1);
        }
    };

    if (type === 'Ghoul') activeOnlyRemover('Restless Skeleton', 3);
    else if (type === 'Knight') activeOnlyRemover('Restless Skeleton', 5);
    else if (type === 'Abomination') activeOnlyRemover('Restless Skeleton', 10);
    else if (type === 'Lich') { activeOnlyRemover('Restless Skeleton', 5); activeOnlyRemover('Ghoul', 1); activeOnlyRemover('Skeleton Knight', 1); }

    state.units.push({ ...template, id: Math.random() + Date.now(), turnsRemaining: template.buildTime });
    log(`Ritual for ${template.name} initiated.`, 'text-indigo-400');
    render();
}

function spawnEnemy() {
    const activeUnits = state.units.filter(u => u.turnsRemaining === 0);
    const pAtk = activeUnits.reduce((s, u) => s + u.atk, 0);
    const pHp = activeUnits.reduce((s, u) => s + u.hp, 0);
    const targetAtk = Math.max(1, Math.floor(pAtk * 0.8));
    const targetHp = Math.max(2, Math.floor(pHp * 0.8));
    let eUnits = [];
    let cAtk = 0, cHp = 0;
    for(let rank of ['Paladin', 'Knight', 'Footman', 'Peasant']){
        const t = enemyUnitTypes[rank];
        while(cAtk + t.atk <= targetAtk && cHp + t.hp <= targetHp){
            eUnits.push({ ...t, id: Math.random() });
            cAtk += t.atk; cHp += t.hp;
            if(eUnits.length > 20) break;
        }
    }
    if(eUnits.length === 0) eUnits.push({ ...enemyUnitTypes['Peasant'], id: Math.random() });
    state.enemy = { units: eUnits };
    log(`The light approaches.`, 'text-red-500');
    render();
}

function handleMainAction() {
    if (state.damageBill > 0) return;
    if (state.enemy) {
        const activeUnits = state.units.filter(u => u.turnsRemaining === 0);
        if (activeUnits.length === 0) return;
        const mAtk = activeUnits.reduce((s, u) => s + u.atk, 0);
        const eAtk = state.enemy.units.reduce((s, u) => s + u.atk, 0);
        let dmg = mAtk;
        while(dmg > 0 && state.enemy.units.length > 0){
            const t = state.enemy.units[0];
            const app = Math.min(t.hp, dmg);
            t.hp -= app; dmg -= app;
            if(t.hp <= 0) state.enemy.units.shift();
        }
        if(state.enemy.units.length === 0) {
            log(`Holy Bastion destroyed.`, 'text-green-500');
            state.enemy = null;
        }
        state.damageBill += eAtk;
        render();
        return;
    }
    state.isProcessing = true;
    render();
    setTimeout(() => {
        document.body.classList.add('rot-active');
        state.weight = state.units.reduce((s, u) => s + (u.turnsRemaining > 0 ? 0 : u.weight), 0);
        const dec = calculateDecayDmg(state.weight);
        state.units = state.units.filter(u => { u.hp -= dec; return u.hp > 0; });
        state.units.forEach(u => { if(u.turnsRemaining > 0) u.turnsRemaining--; });
        if (state.units.length === 0) { state.gameOver = true; state.isProcessing = false; render(); return; }
        const sc = calculateNextSpawnCount();
        for(let i=0; i<sc; i++) state.units.push({ ...unitTypes['Restless Skeleton'], id: Math.random(), turnsRemaining: 0 });
        setTimeout(() => {
            document.body.classList.remove('rot-active');
            state.turn++; state.isProcessing = false; render();
        }, 500);
    }, 300);
}

function resetGame() {
    state = { turn: 1, isProcessing: false, damageBill: 0, intensity: 'normal', weight: 0,
        units: [{ id: 1, ...unitTypes['Restless Skeleton'], turnsRemaining: 0 }],
        enemy: null, gameOver: false
    };
    log("Horde reanimated. The cycle begins anew."); render();
}

render();