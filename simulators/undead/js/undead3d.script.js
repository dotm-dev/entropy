/** GLOBAL VARIABLES **/
let scene, camera, renderer;
let unitMeshes = new Map();
let isMouseDown = false;
let targetRotationX = 0.5, targetRotationY = 0;
let currentRotationX = 0.5, currentRotationY = 0;
let cameraDistance = 25;
let targetDistance = 25;
let hoveredUnitId = null;

const icons = {
    atk: `<svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/></svg>`,
    hp: `<svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>`,
    skeleton: `<svg class="unit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z"/></svg>`,
    ghoul: `<svg class="unit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></svg>`,
    knight: `<svg class="unit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>`,
    abomination: `<svg class="unit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.4 15.63a7.875 6 135 1 1 6.23-6.23 4.5 3.43 135 0 0-6.23 6.23"/><path d="m8.29 12.71-2.6 2.6a2.5 2.5 0 1 0-1.65 4.65A2.5 2.5 0 1 0 8.7 18.3l2.59-2.59"/></svg>`,
    lich: `<svg class="unit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.5 17-.5-1-.5 1h1z"/><path d="M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="12" r="1"/></svg>`,
    holy_peasant: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>`,
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

const config = {
    maxPopWeight: 30,
    spawnIntensities: { low: 0.3, normal: 0.6, high: 0.9 }
};

let state = {
    turn: 1, isProcessing: false, damageBill: 0, intensity: 'normal', weight: 0,
    units: [
        { id: 1, ...unitTypes['Restless Skeleton'], row: 'Skeleton', turnsRemaining: 0 },
        { id: 2, ...unitTypes['Restless Skeleton'], row: 'Skeleton', turnsRemaining: 0 },
        { id: 3, ...unitTypes['Restless Skeleton'], row: 'Skeleton', turnsRemaining: 0 }
    ],
    enemy: null, gameOver: false
};

function log(msg, color = 'text-slate-400') {
    const entry = document.createElement('div');
    entry.className = color; entry.innerText = `> ${msg}`;
    const container = document.getElementById('game-logs');
    if (container) {
        container.appendChild(entry);
        document.getElementById('log-container').scrollTop = document.getElementById('log-container').scrollHeight;
    }
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
    const x = state.weight;
    if (x === 0) return 0;
    return Math.max(1, Math.floor(s * x * (1 - x / config.maxPopWeight)));
}

function getTinyIcon(ico, color) {
    return ico.replace('unit-icon', 'tiny-icon').replace('stat-icon', 'tiny-icon').replace('currentColor', color || 'currentColor');
}

/** MINECRAFT PROCEDURAL MESH GENERATORS WITH COLORS **/
function createMinecraftUnit(type, colorHex) {
    const group = new THREE.Group();
    const boxGeo = (w, h, d) => new THREE.BoxGeometry(w, h, d);

    const getJitterColor = (hex, jitter = 0.05) => {
        const c = new THREE.Color(hex);
        c.r += (Math.random() - 0.5) * jitter;
        c.g += (Math.random() - 0.5) * jitter;
        c.b += (Math.random() - 0.5) * jitter;
        return c;
    };

    const addCube = (w, h, d, x, y, z, hex) => {
        const mesh = new THREE.Mesh(boxGeo(w,h,d), new THREE.MeshLambertMaterial({
            color: getJitterColor(hex),
            transparent: true
        }));
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
        return mesh;
    };

    switch(type) {
        case 'Restless Skeleton': {
            const white = "#e2e8f0";
            addCube(0.5, 0.5, 0.5, 0, 1.0, 0, white);
            addCube(0.1, 0.1, 0.1, -0.15, 1.05, 0.22, "#000");
            addCube(0.1, 0.1, 0.1, 0.15, 1.05, 0.22, "#000");
            addCube(0.35, 0.6, 0.15, 0, 0.45, 0, white);
            addCube(0.1, 0.5, 0.1, -0.25, 0.5, 0, white);
            addCube(0.1, 0.5, 0.1, 0.25, 0.5, 0, white);
            addCube(0.1, 0.5, 0.1, -0.1, 0, 0, white);
            addCube(0.1, 0.5, 0.1, 0.1, 0, 0, white);
            break;
        }
        case 'Ghoul': {
            const teal = "#2dd4bf";
            const rag = "#3f3f46";
            addCube(0.5, 0.5, 0.5, 0, 0.8, 0.2, teal);
            addCube(0.1, 0.1, 0.1, -0.15, 0.85, 0.42, "#ef4444");
            addCube(0.1, 0.1, 0.1, 0.15, 0.85, 0.42, "#ef4444");
            addCube(0.5, 0.6, 0.3, 0, 0.4, 0, teal);
            addCube(0.55, 0.2, 0.35, 0, 0.3, 0, rag);
            addCube(0.15, 0.7, 0.15, -0.35, 0.4, 0.2, teal);
            addCube(0.15, 0.7, 0.15, 0.35, 0.4, 0.2, teal);
            break;
        }
        case 'Skeleton Knight': {
            const blue = "#60a5fa";
            const steel = "#4b5563";
            const gold = "#fbbf24";
            addCube(0.5, 0.5, 0.5, 0, 1.0, 0, "#fff");
            addCube(0.6, 0.2, 0.6, 0, 1.25, 0, steel);
            addCube(0.6, 0.6, 0.3, 0, 0.45, 0, blue);
            const sBase = addCube(0.1, 1.2, 0.8, 0.45, 0.5, 0.2, steel);
            addCube(0.12, 1.2, 0.1, 0.45, 0.5, 0.6, gold);
            addCube(0.12, 1.2, 0.1, 0.45, 0.5, -0.2, gold);
            break;
        }
        case 'Abomination': {
            const rose = "#fb7185";
            const grey = "#9ca3af";
            addCube(1.2, 1.2, 1.2, 0, 0.7, 0, rose);
            addCube(0.4, 0.4, 0.4, -0.3, 1.4, 0.3, "#fecdd3");
            addCube(0.1, 0.3, 0.1, 0, 0.8, 0.61, grey);
            addCube(0.1, 0.3, 0.1, 0.3, 0.6, 0.61, grey);
            addCube(0.5, 1.0, 0.5, 0.9, 0.8, 0, rose);
            addCube(0.4, 0.5, 0.4, -0.3, 0, 0, rose);
            addCube(0.4, 0.5, 0.4, 0.3, 0, 0, rose);
            break;
        }
        case 'The Lich': {
            const purp = "#c084fc";
            const gold = "#fbbf24";
            addCube(0.5, 0.5, 0.5, 0, 1.2, 0, "#fff");
            addCube(0.1, 0.1, 0.1, -0.15, 1.25, 0.22, "#22d3ee");
            addCube(0.1, 0.1, 0.1, 0.15, 1.25, 0.22, "#22d3ee");
            addCube(0.6, 0.1, 0.6, 0, 1.45, 0, gold);
            addCube(0.1, 0.2, 0.1, 0, 1.55, 0.25, gold);
            addCube(0.7, 1.4, 0.7, 0, 0.3, 0, purp);
            addCube(0.8, 0.2, 0.8, 0, -0.3, 0, "#4c1d95");
            break;
        }
    }
    return group;
}

/** ENVIRONMENT GENERATORS **/
function createTombstone() {
    const group = new THREE.Group();
    const grey = "#4b5563";
    const box = (w, h, d, x, y, z) => {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshLambertMaterial({ color: grey }));
        m.position.set(x, y, z);
        m.castShadow = true;
        m.receiveShadow = true;
        group.add(m);
    };
    const variant = Math.random();
    if (variant > 0.5) {
        box(0.8, 1.2, 0.2, 0, 0.6, 0);
    } else {
        box(0.2, 1.4, 0.2, 0, 0.7, 0);
        box(0.8, 0.2, 0.2, 0, 1.0, 0);
    }
    group.rotation.y = (Math.random() - 0.5) * 0.5;
    return group;
}

function createRock(size) {
    const geo = new THREE.IcosahedronGeometry(size, 0);
    const mat = new THREE.MeshLambertMaterial({ color: 0x222222 });
    const rock = new THREE.Mesh(geo, mat);
    rock.castShadow = true;
    rock.receiveShadow = true;
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    return rock;
}

function createOpenGrave() {
    const group = new THREE.Group();
    const hole = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 4),
        new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    hole.rotation.x = -Math.PI / 2;
    hole.position.y = 0.01;
    const mound = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 0.4, 4.5),
        new THREE.MeshLambertMaterial({ color: 0x1a0f0a })
    );
    mound.position.y = -0.1;
    group.add(hole, mound);
    return group;
}

/** THREE.JS ENGINE SETUP **/
function init3D() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030305);
    scene.fog = new THREE.FogExp2(0x030305, 0.02);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 20);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const container = document.getElementById('three-container');
    if (container) container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.7);
    sunLight.position.set(20, 60, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    const spotLight = new THREE.SpotLight(0xc084fc, 1.8);
    spotLight.position.set(0, 40, 5);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.6;
    spotLight.decay = 2;
    spotLight.distance = 150;
    spotLight.castShadow = true;
    scene.add(spotLight);

    const floorGeo = new THREE.CylinderGeometry(40, 40, 2, 64);
    const floorMat = new THREE.MeshPhongMaterial({ color: 0x16161a, shininess: 2 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.scale.set(1.4, 1, 0.8);
    floor.position.y = -1;
    floor.receiveShadow = true;
    scene.add(floor);

    for (let i = 0; i < 60; i++) {
        const angle = Math.PI * 0.95 + (Math.random() * Math.PI * 1.1);
        const dist = 28 + Math.random() * 5;
        const rock = createRock(2 + Math.random() * 5);
        rock.position.set(Math.cos(angle) * dist * 1.2, Math.random() * 3, Math.sin(angle) * dist * 0.7);
        scene.add(rock);
    }

    for (let i = 0; i < 30; i++) {
        const angle = (Math.random() * Math.PI * 2);
        const dist = 10 + Math.random() * 12;
        if (dist < 12 && Math.abs(angle - Math.PI/2) < 0.4) continue;
        const tomb = createTombstone();
        tomb.position.set(Math.cos(angle) * dist * 1.4, 0, Math.sin(angle) * dist * 0.8);
        scene.add(tomb);
    }

    for (let i = 0; i < 8; i++) {
        const grave = createOpenGrave();
        const angle = Math.PI * 0.2 + (Math.random() * Math.PI * 0.6);
        const dist = 8 + Math.random() * 6;
        grave.position.set(Math.cos(angle) * dist * 1.4, 0, -Math.sin(angle) * dist * 0.8);
        grave.rotation.y = Math.random() * Math.PI;
        scene.add(grave);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('mousedown', () => isMouseDown = true);
    window.addEventListener('mouseup', () => isMouseDown = false);
    window.addEventListener('mousemove', (e) => {
        if (isMouseDown) {
            targetRotationY += e.movementX * 0.003;
            targetRotationY = Math.max(-0.8, Math.min(0.8, targetRotationY));
            targetRotationX += e.movementY * 0.003;
            targetRotationX = Math.max(0.1, Math.min(0.9, targetRotationX));
        }
        updateContextualCursor(e);
    });

    window.addEventListener('wheel', (e) => {
        targetDistance += e.deltaY * 0.05;
        targetDistance = Math.max(8, Math.min(28, targetDistance));
    });

    animate();
}

function updateContextualCursor(e) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
    const targets = [];
    unitMeshes.forEach(m => targets.push(m));
    const intersects = raycaster.intersectObjects(targets, true);
    const container = document.getElementById('three-container');

    let foundId = null;
    if (intersects.length > 0) {
        let picked = intersects[0].object;
        while (picked) {
            if (picked.userData.unitId) { foundId = picked.userData.unitId; break; }
            picked = picked.parent;
        }
    }

    hoveredUnitId = foundId; // Set global hover state

    if (foundId) {
        const unit = state.units.find(u => u.id === foundId);
        if (unit) {
            if (unit.turnsRemaining > 0) { container.style.cursor = 'pointer'; }
            else if (state.damageBill > 0) { container.style.cursor = 'crosshair'; }
            else { container.style.cursor = 'grab'; }
            return;
        }
    }
    container.style.cursor = 'grab';
}

function animate() {
    requestAnimationFrame(animate);
    currentRotationX += (targetRotationX - currentRotationX) * 0.1;
    currentRotationY += (targetRotationY - currentRotationY) * 0.1;
    cameraDistance += (targetDistance - cameraDistance) * 0.1;

    camera.position.x = cameraDistance * Math.sin(currentRotationY) * Math.cos(currentRotationX);
    camera.position.z = cameraDistance * Math.cos(currentRotationY) * Math.cos(currentRotationX);
    camera.position.y = cameraDistance * Math.sin(currentRotationX);

    camera.lookAt(0, 1.5, -4);

    const time = Date.now() * 0.001;
    unitMeshes.forEach((mesh, id) => {
        mesh.position.y = (mesh.userData.baseY || 0) + Math.sin(time + id) * 0.15;
        if (mesh.userData.isLich) { mesh.rotation.y += 0.01; }

        // HIGHLIGHT LOGIC
        mesh.traverse(child => {
            if (child.isMesh) {
                if (state.damageBill > 0 && hoveredUnitId === id) {
                    child.material.emissive = new THREE.Color(0x660000);
                    child.material.emissiveIntensity = 0.5;
                } else {
                    child.material.emissive = new THREE.Color(0x000000);
                }
            }
        });
    });
    updateStatsOverlays();
    renderer.render(scene, camera);
}

function updateStatsOverlays() {
    const overlay = document.getElementById('ui-overlay');
    if (!overlay) return;
    overlay.innerHTML = '';
    const rows = ['Abomination', 'Ghoul', 'Skeleton', 'Knight', 'Lich'];

    state.units.forEach(u => {
        if (u.turnsRemaining > 0) return;
        const mesh = unitMeshes.get(u.id);
        if (!mesh) return;
        const vector = mesh.position.clone();
        vector.y -= 0.6;
        vector.project(camera);
        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const y = (vector.y * -0.5 + 0.5) * window.innerHeight;
        if (vector.z < 1) {
            const barContainer = document.createElement('div');
            barContainer.className = 'individual-hp-bar-container';
            barContainer.style.left = `${x - 12}px`;
            barContainer.style.top = `${y}px`;
            const percent = (u.hp / u.maxHp) * 100;
            const fill = document.createElement('div');
            fill.className = 'individual-hp-bar-fill';
            fill.style.width = `${percent}%`;
            if (percent < 40) fill.style.background = '#ef4444';
            barContainer.appendChild(fill);
            overlay.appendChild(barContainer);
        }
    });

    rows.forEach(rowName => {
        const activeInRow = state.units.filter(u => u.row === rowName && u.turnsRemaining === 0);
        if (activeInRow.length === 0) return;
        let sumPos = new THREE.Vector3(0,0,0);
        let count = 0;
        activeInRow.forEach(u => {
            const mesh = unitMeshes.get(u.id);
            if (mesh) { sumPos.add(mesh.position); count++; }
        });
        if (count > 0) {
            const avgPos = sumPos.divideScalar(count);
            avgPos.y += 2.8;
            const vector = avgPos.project(camera);
            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = (vector.y * -0.5 + 0.5) * window.innerHeight;
            if (vector.z < 1) {
                const div = document.createElement('div');
                div.className = 'sprite-stats-overlay';
                div.style.left = `${x}px`;
                div.style.top = `${y}px`;
                div.style.transform = 'translate(-50%, -50%)';
                const template = unitTypes[activeInRow[0].name];
                div.innerHTML = `
                            <div class="group-label">
                                <span class="flex items-center gap-1" style="color: rgba(255,255,255,0.4)">
                                    ${getTinyIcon(icons.atk, 'rgba(255,255,255,0.4)')}
                                    <span style="color:#fff">${template.atk}</span>
                                </span>
                                <span class="flex items-center gap-1" style="color: #4ade80">
                                    ${getTinyIcon(icons.hp, '#064e3b')}
                                    <span style="color:var(--necrotic-green)">${template.maxHp}</span>
                                </span>
                            </div>
                        `;
                overlay.appendChild(div);
            }
        }
    });
}

function syncUnits() {
    const activeIds = state.units.map(u => u.id);
    unitMeshes.forEach((mesh, id) => {
        if (!activeIds.includes(id)) { scene.remove(mesh); unitMeshes.delete(id); }
    });

    const arcRadius = 14;
    const groupAngleMap = { 'Abomination': -0.7, 'Ghoul': -0.35, 'Skeleton': 0, 'Knight': 0.35, 'Lich': 0.7 };

    state.units.forEach((u) => {
        let mesh = unitMeshes.get(u.id);
        const isStasis = u.turnsRemaining > 0;
        const colorVal = u.color.includes('var') ? getComputedStyle(document.documentElement).getPropertyValue(u.color.match(/\(([^)]+)\)/)[1]).trim() : u.color;

        if (!mesh) {
            mesh = createMinecraftUnit(u.name, colorVal);
            mesh.userData.unitId = u.id;
            scene.add(mesh);
            unitMeshes.set(u.id, mesh);
        }

        mesh.traverse(child => {
            if (child.isMesh) {
                child.material.transparent = true;
                child.material.opacity = isStasis ? 0.3 : 1.0;
                child.material.wireframe = isStasis;
            }
        });

        const baseAngle = groupAngleMap[u.row];
        const unitsInGroup = state.units.filter(x => x.row === u.row);
        const idxInGroup = unitsInGroup.findIndex(x => x.id === u.id);

        const localAngleOffset = ((idxInGroup % 3) - 1) * 0.05;
        const localDistOffset = Math.floor(idxInGroup / 3) * 1.6;

        const finalAngle = Math.PI/2 + baseAngle + localAngleOffset;
        const finalRadius = arcRadius - localDistOffset;

        mesh.position.set(
            Math.cos(finalAngle) * finalRadius * 1.4,
            0,
            -Math.sin(finalAngle) * finalRadius * 0.8
        );
        mesh.userData.baseY = 0.5; mesh.userData.isLich = u.name === 'The Lich';
        mesh.lookAt(0, 1, 40);
    });
}

function render() {
    if (state.gameOver) {
        document.getElementById('game-over-screen').style.display = 'flex';
        return;
    }

    const bannerAtkIcon = document.getElementById('banner-atk-icon');
    const bannerHpIcon = document.getElementById('banner-hp-icon');
    const enemyAtkIcon = document.getElementById('enemy-atk-icon');
    const enemyHpIcon = document.getElementById('enemy-hp-icon');

    if (bannerAtkIcon) bannerAtkIcon.innerHTML = icons.atk.replace('stat-icon', 'stat-icon w-6 h-6 opacity-40');
    if (bannerHpIcon) bannerHpIcon.innerHTML = icons.hp.replace('stat-icon', 'stat-icon w-6 h-6 text-green-900');
    if (enemyAtkIcon) enemyAtkIcon.innerHTML = icons.atk.replace('stat-icon', 'stat-icon text-red-500');
    if (enemyHpIcon) enemyHpIcon.innerHTML = icons.hp.replace('stat-icon', 'stat-icon text-red-500');

    if (document.getElementById('turn-count')) document.getElementById('turn-count').innerText = state.turn;

    const bannerCtx = document.getElementById('banner-context');
    const endBtn = document.getElementById('btn-action-main');

    ['low', 'normal', 'high'].forEach(l => {
        const el = document.getElementById('pill-' + l);
        if (el) el.className = 'intensity-pill ' + (state.intensity === l ? 'active' : '');
    });

    if (state.isProcessing) {
        if (bannerCtx) { bannerCtx.innerText = "Rituals in Progress..."; bannerCtx.classList.remove('hidden'); }
        if (endBtn) { endBtn.innerText = "PROCESSING..."; endBtn.disabled = true; }
    } else if (state.damageBill > 0) {
        if (bannerCtx) { bannerCtx.innerText = `ALLOCATION: ${state.damageBill} DAMAGE REMAINING`; bannerCtx.classList.remove('hidden'); bannerCtx.style.color = "var(--blood-red)"; }
        if (endBtn) { endBtn.innerText = "ALLOCATE DAMAGE"; endBtn.classList.add('btn-pay'); endBtn.disabled = true; }
    } else if (state.enemy) {
        if (bannerCtx) { bannerCtx.innerText = "CONFLICT ACTIVE"; bannerCtx.classList.remove('hidden'); bannerCtx.style.color = "var(--blood-red)"; }
        if (endBtn) { endBtn.innerText = "INITIATE CLASH"; endBtn.classList.remove('btn-pay'); endBtn.disabled = false; }
    } else {
        if (bannerCtx) bannerCtx.classList.add('hidden');
        if (endBtn) { endBtn.innerText = "END TURN"; endBtn.classList.remove('btn-pay'); endBtn.disabled = false; }
    }

    const activeWeight = state.units.reduce((s, u) => s + (u.turnsRemaining === 0 ? u.weight : 0), 0);
    const stasisWeight = state.units.reduce((s, u) => s + (u.turnsRemaining > 0 ? u.weight : 0), 0);
    state.weight = activeWeight;

    const activeUnits = state.units.filter(u => u.turnsRemaining === 0);
    if (document.getElementById('total-atk')) document.getElementById('total-atk').innerText = activeUnits.reduce((s, u) => s + u.atk, 0);
    if (document.getElementById('total-hp')) document.getElementById('total-hp').innerText = Math.ceil(activeUnits.reduce((s, u) => s + u.hp, 0));
    if (document.getElementById('pop-weight-text')) document.getElementById('pop-weight-text').innerText = `${activeWeight} / 30`;

    const pb = document.getElementById('pop-bar');
    const pbs = document.getElementById('pop-bar-stasis');
    const pbp = document.getElementById('pop-bar-predict');

    if (pb) pb.style.width = (activeWeight / 30 * 100) + '%';
    if (pbs) pbs.style.width = ((activeWeight + stasisWeight) / 30 * 100) + '%';
    const sc = calculateNextSpawnCount();
    if (pbp) pbp.style.width = ((activeWeight + stasisWeight + sc) / 30 * 100) + '%';

    if (document.getElementById('forecast-spawn')) document.getElementById('forecast-spawn').innerText = '+' + sc;
    if (document.getElementById('forecast-decay')) document.getElementById('forecast-decay').innerText = calculateDecayDmg(activeWeight);

    const buildBtn = (id, type, name, costs, color) => {
        const prev = document.getElementById('icon-'+type+'-get');
        const label = document.getElementById('label-'+type+'-need');

        prev.innerHTML = icons[type === 'abom' ? 'abomination' : type].replace('unit-icon', 'unit-icon-small');
        prev.style.color = color;

        let costStr = '';
        costs.forEach(c => {
            costStr += `<div class="cost-row">${c.count}x ${getTinyIcon(icons[c.icon], c.color || 'var(--color-skeleton)')}</div>`;
        });
        label.innerHTML = `<div class="flex flex-row flex-wrap gap-1.5 mt-1 justify-center w-full">${costStr}</div>`;

        const u = unitTypes[name];
        document.getElementById(`tooltip-merge-${id.split('-')[1]}`).innerHTML = `
                    <div class="tooltip-title" style="color: ${color}">${u.name}</div>
                    <div class="tooltip-stat"><span>${getTinyIcon(icons.atk, color)} ATK</span><span>${u.atk}</span></div>
                    <div class="tooltip-stat"><span>${getTinyIcon(icons.hp, color)} HP</span><span>${u.maxHp}</span></div>
                    <div class="tooltip-stat"><span>RITUAL</span><span>${u.buildTime}T</span></div>
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
    const activeCount = (n) => activeVessels.filter(v => v.name === n).length;
    document.getElementById('merge-Ghoul').disabled = state.isProcessing || activeCount('Restless Skeleton') < 3;
    document.getElementById('merge-Knight').disabled = state.isProcessing || activeCount('Restless Skeleton') < 5;
    document.getElementById('merge-Abomination').disabled = state.isProcessing || activeCount('Restless Skeleton') < 10;
    document.getElementById('merge-Lich').disabled = state.isProcessing || (activeCount('Restless Skeleton') < 5 || activeCount('Ghoul') < 1 || activeCount('Skeleton Knight') < 1);
    document.getElementById('btn-scout').disabled = state.isProcessing || !!state.enemy || state.damageBill > 0;

    const enemyArea = document.getElementById('enemy-area');
    if (enemyArea) enemyArea.classList.toggle('hidden', !state.enemy);
    if (state.enemy) {
        if (document.getElementById('enemy-hp')) document.getElementById('enemy-hp').innerText = state.enemy.units.reduce((s, u) => s + u.hp, 0);
        if (document.getElementById('enemy-atk')) document.getElementById('enemy-atk').innerText = state.enemy.units.reduce((s, u) => s + u.atk, 0);
        const elist = document.getElementById('enemy-units-list');
        if (elist) {
            elist.innerHTML = '';
            state.enemy.units.slice(0, 16).forEach(u => {
                const div = document.createElement('div'); div.className = 'enemy-unit-mini';
                div.innerHTML = `${u.icon}<div class="text-[8px] font-mono mt-1">${u.hp}</div>`;
                elist.appendChild(div);
            });
        }
    }
    syncUnits();
}

function mergeUnit(type) {
    const template = unitTypes[type === 'Knight' ? 'Skeleton Knight' : (type === 'Lich' ? 'The Lich' : type)];
    const remover = (n, c) => {
        for(let i=0; i<c; i++){
            const idx = state.units.findIndex(u => u.name === n && u.turnsRemaining === 0);
            if(idx > -1) state.units.splice(idx, 1);
        }
    };
    for(const [name, count] of Object.entries(template.recipe || {})) remover(name, count);
    if (type === 'Ghoul') remover('Restless Skeleton', 3);
    else if (type === 'Knight') remover('Restless Skeleton', 5);
    else if (type === 'Abomination') remover('Restless Skeleton', 10);

    state.units.push({ ...template, id: Math.random() + Date.now(), turnsRemaining: template.buildTime });
    log(`Ritual for ${template.name} initiated.`, 'text-indigo-400');
    render();
}

function cancelRitual(unitId) {
    const idx = state.units.findIndex(u => u.id === unitId);
    if (idx === -1 || state.units[idx].turnsRemaining === 0) return;
    const unit = state.units[idx];
    for (const [name, count] of Object.entries(unit.recipe || {})) {
        for (let i = 0; i < count; i++) state.units.push({ ...unitTypes[name], id: Math.random() + Date.now(), turnsRemaining: 0 });
    }
    state.units.splice(idx, 1);
    log(`Ritual collapsed. Essence recovered.`, 'text-purple-400');
    render();
}

function payBill(unitId) {
    const idx = state.units.findIndex(u => u.id === unitId && u.turnsRemaining === 0);
    if (idx === -1) return;
    state.units[idx].hp -= 1; state.damageBill -= 1;
    if (state.units[idx].hp <= 0) {
        log(`Vessel extinguished in allocation.`, 'text-red-500');
        state.units.splice(idx, 1);
    }
    if (state.units.length === 0) state.gameOver = true;
    render();
}

function spawnEnemy() {
    const activeUnits = state.units.filter(u => u.turnsRemaining === 0);
    const targetAtk = Math.max(1, Math.floor(activeUnits.reduce((s, u) => s + u.atk, 0) * 0.8));
    const targetHp = Math.max(2, Math.floor(activeUnits.reduce((s, u) => s + u.hp, 0) * 0.8));
    let eUnits = [], cAtk = 0, cHp = 0;
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
        let dmgP = mAtk;
        while(dmgP > 0 && state.enemy.units.length > 0){
            const t = state.enemy.units[0];
            const app = Math.min(t.hp, dmgP);
            t.hp -= app; dmgP -= app;
            if(t.hp <= 0) state.enemy.units.shift();
        }
        if(state.enemy.units.length === 0) {
            log(`Holy Bastion destroyed.`, 'text-green-500');
            state.enemy = null;
        }
        state.damageBill += eAtk;
        render(); return;
    }
    state.isProcessing = true; render();
    setTimeout(() => {
        const activeWeight = state.units.reduce((sum, u) => sum + (u.turnsRemaining === 0 ? u.weight : 0), 0);
        const dec = calculateDecayDmg(activeWeight);
        state.units = state.units.filter(u => { u.hp -= dec; return u.hp > 0; });
        state.units.forEach(u => { if(u.turnsRemaining > 0) u.turnsRemaining--; });
        if (state.units.length === 0) { state.gameOver = true; state.isProcessing = false; render(); return; }
        const sc = calculateNextSpawnCount();
        for(let i=0; i<sc; i++) state.units.push({ ...unitTypes['Restless Skeleton'], id: Math.random() + Date.now(), turnsRemaining: 0, row: 'Skeleton' });
        state.turn++; state.isProcessing = false; render();
    }, 500);
}

function setIntensity(lvl) { state.intensity = lvl; render(); }

window.onload = function () {
    init3D(); render();
    window.addEventListener('click', (e) => {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
        raycaster.setFromCamera(mouse, camera);
        const targets = [];
        unitMeshes.forEach(m => targets.push(m));
        const intersects = raycaster.intersectObjects(targets, true);
        if (intersects.length > 0) {
            let picked = intersects[0].object;
            let foundId = null;
            while (picked) {
                if (picked.userData.unitId) { foundId = picked.userData.unitId; break; }
                picked = picked.parent;
            }
            if (foundId) {
                const unit = state.units.find(u => u.id === foundId);
                if (unit) {
                    if (unit.turnsRemaining > 0) cancelRitual(foundId);
                    else if (state.damageBill > 0) payBill(foundId);
                }
            }
        }
    });
};