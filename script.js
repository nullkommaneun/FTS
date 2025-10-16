document.addEventListener('DOMContentLoaded', () => {

    // === FEHLER-TOOL (unverändert) ===
    // ... (Code vom letzten Mal, kann hier eingeklappt bleiben)
    const errorLogContainer = document.getElementById('error-log-container');
    window.addEventListener('error', function(event) { console.error("Unerwarteter Fehler:", event); errorLogContainer.style.display = 'block'; const errorMessageElement = document.createElement('div'); errorMessageElement.className = 'error-message'; const fileName = event.filename.split('/').pop(); errorMessageElement.textContent = `🐛 FEHLER: "${event.message}"\n📄 Datei: ${fileName} (Zeile: ${event.lineno})`; errorLogContainer.prepend(errorMessageElement); });
    const errorTestButton = document.getElementById('errorTestButton');
    errorTestButton.addEventListener('click', () => { eineFunktionDieNichtExistiert(); });


    try {
        // === GRUNDSETUP DER SIMULATION ===
        const canvas = document.getElementById('simulationCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800; // Passt zur Layout-Größe (20 * 40px)
        canvas.height = 480; // Passt zur Layout-Größe (12 * 40px)
        
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
        function drawLayout() {
            for (let row = 0; row < layout.length; row++) {
                for (let col = 0; col < layout[row].length; col++) {
                    const tileType = layout[row][col];
                    let color;
                    switch (tileType) {
                        case 1: color = COLORS.wall; break; case 2: color = COLORS.station; break;
                        case 3: color = COLORS.goal; break; default: color = COLORS.path; break;
                    }
                    ctx.fillStyle = color;
                    ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    ctx.strokeStyle = '#ddd';
                    ctx.strokeRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }
            }
        }

        // --- NEU: LOGIK FÜR DEN EDITOR ---

        let selectedTileType = 1; // Startet mit "Wand" als ausgewähltes Werkzeug
        let isPainting = false;

        const paletteItems = document.querySelectorAll('.palette-item');
        paletteItems.forEach(item => {
            item.addEventListener('click', () => {
                // Entferne 'selected' von allen anderen Items
                paletteItems.forEach(p => p.classList.remove('selected'));
                // Füge 'selected' zum geklickten Item hinzu
                item.classList.add('selected');
                // Aktualisiere den ausgewählten Werkzeug-Typ
                selectedTileType = parseInt(item.dataset.type);
            });
        });

        function paintTile(event) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            const col = Math.floor(mouseX / TILE_SIZE);
            const row = Math.floor(mouseY / TILE_SIZE);

            // Prüfen, ob die Maus-Position innerhalb des gültigen Layout-Bereichs liegt
            if (row >= 0 && row < layout.length && col >= 0 && col < layout[0].length) {
                // Nur malen, wenn sich der Kachel-Typ ändert, um unnötiges Neuzeichnen zu vermeiden
                if (layout[row][col] !== selectedTileType) {
                    layout[row][col] = selectedTileType;
                    drawLayout(); // Das komplette Layout neu zeichnen
                }
            }
        }

        canvas.addEventListener('mousedown', (event) => {
            isPainting = true;
            paintTile(event);
        });

        canvas.addEventListener('mousemove', (event) => {
            if (isPainting) {
                paintTile(event);
            }
        });
        
        canvas.addEventListener('mouseup', () => {
            isPainting = false;
        });

        canvas.addEventListener('mouseleave', () => {
            isPainting = false; // Stoppt das Malen, wenn die Maus das Canvas verlässt
        });

        // --- HAUPT-LOGIK ---
        drawLayout();
        console.log("Layout gezeichnet. Editor ist aktiv.");

    } catch (error) {
        // Fehlerbehandlung bleibt unverändert
        const event = new ErrorEvent('error', { error: error, message: `Schwerer Initialisierungsfehler: ${error.message}`, filename: 'script.js', lineno: 0 });
        window.dispatchEvent(event);
    }
});
