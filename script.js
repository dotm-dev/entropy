const manifest = [
    {
        id: "undead",
        name: "The Undead",
        description: "Necrotic manifestation and ritual cycle simulations.",
        palette: { primary: "#c084fc", secondary: "#f472b6", accent: "#f3f4f6" },
        simulators: [
            {
                title: "Necrotic Sanctum 3D",
                file: "undead3d.html",
                tags: ["3D", "Minecraft", "Advanced"],
                description: "Spatial simulation of the graveyard grounds with voxel-minion manifestation and rituals."
            },
            {
                title: "Undead Management Hub",
                file: "undead.html",
                tags: ["2D", "Strategic", "Core"],
                description: "Tactical interface for managing mass horde growth, stasis, and complexity."
            }
        ]
    },
    {
        id: "humans",
        name: "The Humans",
        description: "Bastion defense and standing army organization.",
        palette: { primary: "#3b82f6", secondary: "#fbbf24", accent: "#ffffff" },
        simulators: []
    },
    {
        id: "demons",
        name: "The Demons",
        description: "Abyssal summoning and infernal sacrifice mechanics.",
        palette: { primary: "#ef4444", secondary: "#000000", accent: "#f97316" },
        simulators: []
    },
    {
        id: "elves",
        name: "The Elven Enclave",
        description: "Nature-arcane integration and ancestral grace simulations.",
        palette: { primary: "#22d3ee", secondary: "#86efac", accent: "#1e3a8a" },
        simulators: []
    },
    {
        id: "dwarves",
        name: "The Dwarves",
        description: "Forge heat dynamics and mountain structural integrity.",
        palette: { primary: "#92400e", secondary: "#451a03", accent: "#f97316" },
        simulators: []
    },
    {
        id: "orcs",
        name: "The Orcs",
        description: "Primal strength and chaotic horde expansion patterns.",
        palette: { primary: "#f97316", secondary: "#eab308", accent: "#bef264" },
        simulators: []
    },
    {
        id: "shrooms",
        name: "The Shrooms",
        description: "Fungal spore dispersal and ecosystem takeover.",
        palette: { primary: "#22c55e", secondary: "#14532d", accent: "#1e3a8a" },
        simulators: []
    },
    {
        id: "trolls",
        name: "The Trolls",
        description: "Biological regeneration and tribal warfare logic.",
        palette: { primary: "#b91c1c", secondary: "#7dd3fc", accent: "#fbbf24" },
        simulators: []
    },
    {
        id: "void",
        name: "The Void",
        description: "Non-physical simulations and existential erasure.",
        palette: { primary: "#7e22ce", secondary: "#000000", accent: "#ffffff" },
        simulators: []
    },
    {
        id: "the_one",
        name: "The One",
        description: "Singular vessel convergence and absolute manifest.",
        palette: { primary: "#fb7185", secondary: "#881337", accent: "#ffe4e6" },
        simulators: []
    }
];

function initPortal() {
    const grid = document.getElementById('portal-grid');

    manifest.forEach(faction => {
        const section = document.createElement('section');
        section.className = "space-y-12";
        const hasSims = faction.simulators.length > 0;

        section.innerHTML = `
                    <div class="flex flex-col md:flex-row md:items-end gap-6 pb-6 border-b border-white/5">
                        <h2 class="faction-header text-4xl font-black" style="color: ${faction.palette.primary}">
                            ${faction.name}
                        </h2>
                        <span class="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-2">
                            Status: ${hasSims ? 'Operational' : 'Synthesis Pending'}
                        </span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        ${hasSims ? faction.simulators.map(sim => `
                            <a href="simulators/${sim.file}" class="glass-card p-10 group relative border-white/5">
                                <div class="card-accent-bar" style="background-color: ${faction.palette.primary}; color: ${faction.palette.primary}"></div>
                                <div class="scanline" style="background: linear-gradient(0deg, ${faction.palette.primary}22 0%, transparent 100%)"></div>

                                <div class="flex justify-between items-start mb-8 relative z-10">
                                    <h3 class="text-2xl font-black text-white group-hover:text-white transition-colors leading-none" style="text-shadow: 0 0 20px ${faction.palette.primary}33">
                                        ${sim.title}
                                    </h3>
                                    <div class="text-3xl transition-all duration-500 group-hover:translate-x-2" style="color: ${faction.palette.primary}">→</div>
                                </div>

                                <div class="flex flex-wrap gap-2 mb-8 relative z-10">
                                    ${sim.tags.map(tag => `
                                        <span class="sim-tag" style="color: ${faction.palette.primary}; background: ${faction.palette.primary}11; border-color: ${faction.palette.primary}33">
                                            ${tag}
                                        </span>
                                    `).join('')}
                                </div>

                                <p class="text-slate-400 text-sm leading-relaxed mb-8 relative z-10 font-medium">
                                    ${sim.description}
                                </p>

                                <div class="pt-6 border-t border-white/5 font-mono text-[9px] text-slate-600 group-hover:text-slate-300 transition-colors relative z-10">
                                    DEPLOY: /SIMULATORS/${sim.file.toUpperCase()}
                                </div>
                            </a>
                        `).join('') : `
                            <div class="glass-card p-10 opacity-20 grayscale border-dashed flex flex-col justify-center min-h-[200px]">
                                <div class="text-slate-600 text-[10px] font-mono uppercase tracking-widest mb-4">Core Locked</div>
                                <h3 class="text-xl font-bold text-slate-500 italic mb-2">No Active Stream</h3>
                                <p class="text-slate-700 text-xs font-mono">ENCRYPTED_FACTION_DATA_PENDING</p>
                            </div>
                        `}
                    </div>
                `;

        grid.appendChild(section);
    });
}

window.onload = initPortal;