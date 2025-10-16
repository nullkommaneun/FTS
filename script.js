// Stellt sicher, dass das Skript erst nach dem Laden der kompletten HTML-Seite ausgeführt wird.
document.addEventListener('DOMContentLoaded', () => {

    // === MÄCHTIGES FEHLER-TOOL ===
    // Dieser "globale" Event-Listener fängt alle Fehler ab, die im Code auftreten.
    // Das ist extrem nützlich für die Fehlersuche (Debugging).
    window.addEventListener('error', function(event) {
        console.error("Ein unerwarteter Fehler ist aufgetreten:", {
            message: event.message,
            filename: event.filename,
            lineNumber: event.lineno,
            errorObject: event.error
        });
        // Optional: Man könnte hier die Simulation anhalten, um weitere Fehler zu vermeiden.
    });

    try {
        // === GRUNDSETUP DER SIMULATION ===
        
        console.log("FTS Simulation wird initialisiert...");

        const canvas = document.getElementById('simulationCanvas');
        const ctx = canvas.getContext('2d');

        // Wir setzen die Größe der Simulationsfläche fest.
        canvas.width = 800;
        canvas.height = 600;

        // Test-Zeichnung, um zu prüfen, ob alles funktioniert.
        // Wir füllen den Hintergrund mit einer leichten Farbe.
        ctx.fillStyle = '#e9e9e9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'red';
        ctx.font = '20px Arial';
        ctx.fillText('Simulation erfolgreich geladen! Hier startet die Action.', 50, 50);

        console.log("Canvas und Kontext sind bereit. Die Simulation kann beginnen.");

        // Hier wird später die Haupt-Schleife der Simulation aufgerufen.
        // function gameLoop() { ... }
        // requestAnimationFrame(gameLoop);

    } catch (error) {
        // Fängt Initialisierungsfehler ab, falls z.B. das Canvas-Element nicht gefunden wird.
        console.error("Schwerwiegender Fehler bei der Initialisierung der Simulation:", error);
        alert("Die Simulation konnte nicht gestartet werden. Bitte die Konsole prüfen.");
    }
});
