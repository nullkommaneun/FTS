document.addEventListener('DOMContentLoaded', () => {

    // === FEHLER-TOOL (unverändert) ===
    const errorLogContainer = document.getElementById('error-log-container');
    window.addEventListener('error', function(event) {
        console.error("Unerwarteter Fehler:", event);
        errorLogContainer.style.display = 'block';
        const errorMessageElement = document.createElement('div');
        errorMessageElement.className = 'error-message';
        const fileName = event.filename.split('/').pop();
        errorMessageElement.textContent = `🐛 FEHLER: "${event.message}"\n📄 Datei: ${fileName} (Zeile: ${event.lineno})`;
        errorLogContainer.prepend(errorMessageElement);
    });
    const errorTestButton = document.getElementById('errorTestButton');
    errorTestButton.addEventListener('click', () => {
        eineFunktionDieNichtExistiert();
    });

    try {
        // === GRUNDSETUP DER SIMULATION (leicht angepasst) ===
        console.log("FTS Simulation wird initialisiert...");
        const canvas = document.getElementById('simulationCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;

        // --- NEU: Konfiguration für unsere Simulation ---
        const TILE_SIZE = 40; // Jedes Feld im Raster ist 40x40 Pixel groß.
        const COLORS = {
            wall: '#333',
            path: '#fff',
            station: '#3498db', // Blau
            goal: '#2ecc71'     // Grün
        };

        // --- NEU: Das Layout unseres Lagers als 2D-Array (unsere "Karte") ---
        // 1 = Wand, 0 = Weg, 2 = Ladestation, 3 = Ziel
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

        // --- NEU: Funktion zum Zeichnen des Layouts ---
        function drawLayout() {
            for (let row = 0; row < layout.length; row++) {
                for (let col = 0; col < layout[row].length; col++) {
                    const tileType = layout[row][col];
                    let color;

                    switch (tileType) {
                        case 1: color = COLORS.wall; break;
                        case 2: color = COLORS.station; break;
                        case 3: color = COLORS.goal; break;
                        default: color = COLORS.path; break;
                    }
                    
                    ctx.fillStyle = color;
                    ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    
                    // Optional: Ein dünnes Gitter zeichnen für bessere Optik
                    ctx.strokeStyle = '#ddd';
                    ctx.strokeRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }
            }
        }
        
        // --- HAUPT-LOGIK ---
        // Der alte Code zum Füllen des Canvas wird jetzt durch den Aufruf unserer neuen Funktion ersetzt.
        drawLayout();
        
        console.log("Layout erfolgreich gezeichnet.");

    } catch (error) {
        // Fehlerbehandlung bleibt unverändert
        const event = new ErrorEvent('error', {
            error: error,
            message: `Schwerer Initialisierungsfehler: ${error.message}`,
            filename: 'script.js',
            lineno: 0 
        });
        window.dispatchEvent(event);
    }
});
