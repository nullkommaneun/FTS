document.addEventListener('DOMContentLoaded', () => {

    // === FEHLER-TOOL (unverändert) ===
    // ...
    const errorLogContainer = document.getElementById('error-log-container');
    window.addEventListener('error', function(event) { console.error("Unerwarteter Fehler:", event); errorLogContainer.style.display = 'block'; const errorMessageElement = document.createElement('div'); errorMessageElement.className = 'error-message'; const fileName = event.filename.split('/').pop(); errorMessageElement.textContent = `🐛 FEHLER: "${event.message}"\n📄 Datei: ${fileName} (Zeile: ${event.lineno})`; errorLogContainer.prepend(errorMessageElement); });
    const errorTestButton = document.getElementById('errorTestButton');
    errorTestButton.addEventListener('click', () => { eineFunktionDieNichtExistiert(); });

    try {
        // === GRUNDSETUP (unverändert) ===
        // ...
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
        // ...
        function drawLayout() { for (let row = 0; row < layout.length; row++) { for (let col = 0; col < layout[row].length; col++) { const tileType = layout[row][col]; let color; switch (tileType) { case 1: color = COLORS.wall; break; case 2: color = COLORS.station; break; case 3: color = COLORS.goal; break; default: color = COLORS.path; break; } ctx.fillStyle = color; ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE); ctx.strokeStyle = '#ddd'; ctx.strokeRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE); } } }
        let selectedTileType = 1; let isPainting = false; const paletteItems = document.querySelectorAll('.palette-item'); paletteItems.forEach(item => { item.addEventListener('click', () => { paletteItems.forEach(p => p.classList.remove('selected')); item.classList.add('selected'); selectedTileType = parseInt(item.dataset.type); }); }); function paintTile(event) { const rect = canvas.getBoundingClientRect(); const mouseX = event.clientX - rect.left; const mouseY = event.clientY - rect.top; const col = Math.floor(mouseX / TILE_SIZE); const row = Math.floor(mouseY / TILE_SIZE); if (row >= 0 && row < layout.length && col >= 0 && col < layout[0].length) { if (layout[row][col] !== selectedTileType) { layout[row][col] = selectedTileType; drawLayout(); } } }
        canvas.addEventListener('mousedown', (event) => { isPainting = true; paintTile(event); }); canvas.addEventListener('mousemove', (event) => { if (isPainting) { paintTile(event); } }); canvas.addEventListener('mouseup', () => { isPainting = false; }); canvas.addEventListener('mouseleave', () => { isPainting = false; });

        // --- AKTUALISIERT: Die FTS-Klasse bekommt neue Eigenschaften für die Bewegung ---
        class FTS {
            constructor(col, row, color = 'orange') {
                // NEU: Wir speichern die exakte Pixel-Position für flüssige Bewegungen
                this.x = col * TILE_SIZE + TILE_SIZE / 2;
                this.y = row * TILE_SIZE + TILE_SIZE / 2;
                
                this.color = color;
                this.speed = 2; // Pixel pro Frame
                
                this.path = []; // Der Pfad, dem das FTS folgen soll
                this.pathIndex = 0; // Der aktuelle Zielpunkt im Pfad
            }
            
            // NEU: Setzt einen neuen Pfad für das FTS
            setPath(path) {
                this.path = path;
                this.pathIndex = 0;
            }

            // NEU: Die Update-Methode steuert die gesamte Bewegungslogik
            update() {
                // Wenn es keinen Pfad gibt oder der Pfad abgeschlossen ist, tue nichts.
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
                    // Wir sind am Zielpunkt angekommen
                    this.x = targetX;
                    this.y = targetY;
                    this.pathIndex++; // Nächstes Ziel im Pfad ansteuern
                } else {
                    // Bewege dich in Richtung Zielpunkt
                    this.x += (dx / distance) * this.speed;
                    this.y += (dy / distance) * this.speed;
                }
            }

            draw(context) {
                // Zeichnet jetzt an den exakten Pixel-Koordinaten
                const radius = TILE_SIZE / 3;
                context.fillStyle = this.color;
                context.beginPath();
                context.arc(this.x, this.y, radius, 0, Math.PI * 2);
                context.fill();
                context.strokeStyle = 'black';
                context.stroke();
            }
        }

        // === FTS-Flotte erstellen (unverändert) ===
        const fts1 = new FTS(2, 2, '#f1c40f');
        const fts2 = new FTS(4, 8, '#e74c3c');
        const vehicles = [fts1, fts2];

        // --- NEU: Wir definieren einfache Test-Pfade für unsere FTS ---
        const path1 = [
            { col: 2, row: 8 },
            { col: 6, row: 8 },
            { col: 6, row: 2 },
            { col: 2, row: 2 }
        ];
        fts1.setPath(path1);

        const path2 = [
            { col: 17, row: 10 },
            { col: 17, row: 1 },
            { col: 4,  row: 1 },
            { col: 4,  row: 8 },
        ];
        fts2.setPath(path2);


        // --- AKTUALISIERT: Die Hauptschleife ruft jetzt auch die update-Methode auf ---
        function gameLoop() {
            drawLayout();
            
            // FÜR JEDES FAHRZEUG:
            for (const vehicle of vehicles) {
                vehicle.update(); // 1. Position aktualisieren (NEU)
                vehicle.draw(ctx);  // 2. An der neuen Position zeichnen
            }

            requestAnimationFrame(gameLoop);
        }

        // --- HAUPT-LOGIK (unverändert) ---
        console.log("Starte Simulations-Loop...");
        gameLoop();

    } catch (error) {
        // ... Fehlerbehandlung
        const event = new ErrorEvent('error', { error: error, message: `Schwerer Initialisierungsfehler: ${error.message}`, filename: 'script.js', lineno: 0 });
        window.dispatchEvent(event);
    }
});
