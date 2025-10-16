document.addEventListener('DOMContentLoaded', () => {

    // === FEHLER-TOOL (unverändert) ===
    const errorLogContainer = document.getElementById('error-log-container');
    window.addEventListener('error', function(event) { console.error("Unerwarteter Fehler:", event); errorLogContainer.style.display = 'block'; const errorMessageElement = document.createElement('div'); errorMessageElement.className = 'error-message'; const fileName = event.filename.split('/').pop(); errorMessageElement.textContent = `🐛 FEHLER: "${event.message}"\n📄 Datei: ${fileName} (Zeile: ${event.lineno})`; errorLogContainer.prepend(errorMessageElement); });
    const errorTestButton = document.getElementById('errorTestButton');
    errorTestButton.addEventListener('click', () => { eineFunktionDieNichtExistiert(); });

    try {
        // === GRUNDSETUP (unverändert) ===
        const canvas = document.getElementById('simulationCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 480;
        const TILE_SIZE = 40;
        const COLORS = { wall: '#333', path: '#fff', station: '#3498db', goal: '#2ecc71' };

        // === LAYOUT (unverändert) ===
        const layout = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 3, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 3, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];

        // === ZEICHEN-FUNKTION & EDITOR (unverändert) ===
        function drawLayout() { for (let row = 0; row < layout.length; row++) { for (let col = 0; col < layout[row].length; col++) { const tileType = layout[row][col]; let color; switch (tileType) { case 1: color = COLORS.wall; break; case 2: color = COLORS.station; break; case 3: color = COLORS.goal; break; default: color = COLORS.path; break; } ctx.fillStyle = color; ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE); ctx.strokeStyle = '#ddd'; ctx.strokeRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE); } } }
        let selectedTileType = 1; let isPainting = false; const paletteItems = document.querySelectorAll('.palette-item'); paletteItems.forEach(item => { item.addEventListener('click', () => { paletteItems.forEach(p => p.classList.remove('selected')); item.classList.add('selected'); selectedTileType = parseInt(item.dataset.type); }); }); function paintTile(event) { const rect = canvas.getBoundingClientRect(); const mouseX = event.clientX - rect.left; const mouseY = event.clientY - rect.top; const col = Math.floor(mouseX / TILE_SIZE); const row = Math.floor(mouseY / TILE_SIZE); if (row >= 0 && row < layout.length && col >= 0 && col < layout[0].length) { if (layout[row][col] !== selectedTileType) { layout[row][col] = selectedTileType; drawLayout(); } } }
        canvas.addEventListener('mousedown', (event) => { isPainting = true; paintTile(event); }); canvas.addEventListener('mousemove', (event) => { if (isPainting) { paintTile(event); } }); canvas.addEventListener('mouseup', () => { isPainting = false; }); canvas.addEventListener('mouseleave', () => { isPainting = false; });

        // === FTS-KLASSE (unverändert) ===
        class FTS {
            constructor(col, row, color = 'orange') {
                this.x = col * TILE_SIZE + TILE_SIZE / 2;
                this.y = row * TILE_SIZE + TILE_SIZE / 2;
                this.color = color;
                this.speed = 2; // Pixel pro Frame (für flüssige Animation)
                this.path = [];
                this.pathIndex = 0;
            }
            
            setPath(path) {
                this.path = path;
                this.pathIndex = 0;
            }

            update() {
                if (this.path.length === 0 || this.pathIndex >= this.path.length) {
                    return;
                }

                const targetNode = this.path[this.pathIndex];
                const targetX = targetNode.col * TILE_SIZE + TILE_SIZE / 2;
                const targetY = targetNode.row * TILE_SIZE + TILE_SIZE / 2;

                const dx = targetX - this.x;
                const dy = targetY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.speed) {
                    // Am aktuellen Zielpunkt angekommen, nimm den nächsten
                    this.x = targetX;
                    this.y = targetY;
                    this.pathIndex++;
                    // Optional: Wenn der Pfad komplett ist, könnte er hier wieder von vorne beginnen
                    // if (this.pathIndex >= this.path.length) { this.pathIndex = 0; }
                } else {
                    // Bewege dich in Richtung Zielpunkt
                    this.x += (dx / distance) * this.speed;
                    this.y += (dy / distance) * this.speed;
                }
            }

            draw(context) {
                const radius = TILE_SIZE / 3;
                context.fillStyle = this.color;
                context.beginPath();
                context.arc(this.x, this.y, radius, 0, Math.PI * 2);
                context.fill();
                context.strokeStyle = 'black';
                context.stroke();
            }
        }

        // === FTS-Flotte erstellen ===
        const fts1 = new FTS(2, 2, '#f1c40f'); // Gelb
        const fts2 = new FTS(4, 8, '#e74c3c'); // Rot
        const vehicles = [fts1, fts2];

        // --- AKTUALISIERT: Wir definieren jetzt GÜLTIGE Test-Pfade für unsere FTS ---
        // fts1: Start (2,2) -> fährt ein Stück nach unten, dann rechts
        const path1 = [
            { col: 2, row: 3 },
            { col: 2, row: 4 },
            { col: 3, row: 4 },
            { col: 4, row: 4 },
            { col: 4, row: 3 },
            { col: 4, row: 2 } // Kehrt zum Startbereich zurück
        ];
        fts1.setPath(path1);

        // fts2: Start (4,8) -> fährt ein Stück nach rechts, dann zur Ladestation
        const path2 = [
            { col: 5, row: 8 },
            { col: 6, row: 8 },
            { col: 7, row: 8 },
            { col: 7, row: 7 },
            { col: 7, row: 6 },
            { col: 7, row: 5 },
            { col: 8, row: 5 },
            { col: 9, row: 5 }, // Zum Feld neben der Ladestation
            { col: 9, row: 4 }  // Zur Ladestation selbst
        ];
        fts2.setPath(path2);


        // === HAUPTSCHLEIFE (Game Loop) (unverändert) ===
        function gameLoop() {
            drawLayout();
            for (const vehicle of vehicles) {
                vehicle.update();
                vehicle.draw(ctx);
            }
            requestAnimationFrame(gameLoop);
        }

        console.log("Starte Simulations-Loop mit korrigierten Pfaden...");
        gameLoop();

    } catch (error) {
        const event = new ErrorEvent('error', { error: error, message: `Schwerer Initialisierungsfehler: ${error.message}`, filename: 'script.js', lineno: 0 });
        window.dispatchEvent(event);
    }
});
