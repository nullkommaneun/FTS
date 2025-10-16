document.addEventListener('DOMContentLoaded', () => {

    // === FEHLER-TOOL (unverändert) ===
    // ... (Code vom letzten Mal)
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
        
        // === ZEICHEN-FUNKTION (unverändert) ===
        function drawLayout() { /* ... (Code vom letzten Mal) ... */ 
            for (let row = 0; row < layout.length; row++) { for (let col = 0; col < layout[row].length; col++) { const tileType = layout[row][col]; let color; switch (tileType) { case 1: color = COLORS.wall; break; case 2: color = COLORS.station; break; case 3: color = COLORS.goal; break; default: color = COLORS.path; break; } ctx.fillStyle = color; ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE); ctx.strokeStyle = '#ddd'; ctx.strokeRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE); } } }

        // === EDITOR-LOGIK (unverändert) ===
        // ... (Code vom letzten Mal)
        let selectedTileType = 1; let isPainting = false; const paletteItems = document.querySelectorAll('.palette-item'); paletteItems.forEach(item => { item.addEventListener('click', () => { paletteItems.forEach(p => p.classList.remove('selected')); item.classList.add('selected'); selectedTileType = parseInt(item.dataset.type); }); }); function paintTile(event) { const rect = canvas.getBoundingClientRect(); const mouseX = event.clientX - rect.left; const mouseY = event.clientY - rect.top; const col = Math.floor(mouseX / TILE_SIZE); const row = Math.floor(mouseY / TILE_SIZE); if (row >= 0 && row < layout.length && col >= 0 && col < layout[0].length) { if (layout[row][col] !== selectedTileType) { layout[row][col] = selectedTileType; } } }
        canvas.addEventListener('mousedown', (event) => { isPainting = true; paintTile(event); }); canvas.addEventListener('mousemove', (event) => { if (isPainting) { paintTile(event); } }); canvas.addEventListener('mouseup', () => { isPainting = false; }); canvas.addEventListener('mouseleave', () => { isPainting = false; });

        // --- NEU: Die "Blaupause" für unsere FTS ---
        class FTS {
            constructor(col, row, color = 'orange') {
                this.col = col; // Spalte im Raster
                this.row = row; // Zeile im Raster
                this.color = color;
            }

            // Methode zum Zeichnen des FTS
            draw(context) {
                const x = this.col * TILE_SIZE + TILE_SIZE / 2; // Pixel-Koordinate X (Zentrum)
                const y = this.row * TILE_SIZE + TILE_SIZE / 2; // Pixel-Koordinate Y (Zentrum)
                const radius = TILE_SIZE / 3; // Radius des Kreises

                context.fillStyle = this.color;
                context.beginPath();
                context.arc(x, y, radius, 0, Math.PI * 2);
                context.fill();
                context.strokeStyle = 'black';
                context.stroke();
            }
        }

        // --- NEU: Erstellen unserer FTS-Flotte ---
        // Wir erstellen ein FTS an der Raster-Position (Spalte 2, Zeile 2)
        const fts1 = new FTS(2, 2, '#f1c40f'); // Gelb
        const fts2 = new FTS(4, 8, '#e74c3c'); // Rot

        // In diesem Array verwalten wir alle unsere Fahrzeuge
        const vehicles = [fts1, fts2];


        // --- NEU: Die Hauptschleife der Simulation (Game Loop) ---
        function gameLoop() {
            // 1. Canvas komplett leeren (wird durch drawLayout ersetzt)
            // ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 2. Das Lager-Layout neu zeichnen
            drawLayout();

            // 3. Alle Fahrzeuge an ihrer aktuellen Position zeichnen
            for (const vehicle of vehicles) {
                vehicle.draw(ctx);
            }

            // 4. Den Browser anweisen, die gameLoop-Funktion zum nächstmöglichen Zeitpunkt
            //    wieder aufzurufen. Das sorgt für flüssige Animationen.
            requestAnimationFrame(gameLoop);
        }


        // --- HAUPT-LOGIK ---
        console.log("Layout gezeichnet. Editor ist aktiv. Starte Simulations-Loop...");
        
        // Starte die Game Loop zum ersten Mal!
        gameLoop();

    } catch (error) {
        const event = new ErrorEvent('error', { error: error, message: `Schwerer Initialisierungsfehler: ${error.message}`, filename: 'script.js', lineno: 0 });
        window.dispatchEvent(event);
    }
});
