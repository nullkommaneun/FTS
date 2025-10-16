document.addEventListener('DOMContentLoaded', () => {

    // === ERWEITERTES FEHLER-TOOL FÜR DIE WEBSITE ===
    const errorLogContainer = document.getElementById('error-log-container');

    window.addEventListener('error', function(event) {
        // Log für die Konsole (am PC weiterhin nützlich)
        console.error("Unerwarteter Fehler:", event);

        // Mache den Fehler-Container auf der Webseite sichtbar
        errorLogContainer.style.display = 'block';

        // Erstelle ein neues Element für diese spezifische Fehlermeldung
        const errorMessageElement = document.createElement('div');
        errorMessageElement.className = 'error-message';
        
        // Extrahiere den Dateinamen aus dem vollen Pfad für eine kürzere Anzeige
        const fileName = event.filename.split('/').pop();
        
        // Formatiere die Fehlermeldung für die Anzeige
        errorMessageElement.textContent = `🐛 FEHLER: "${event.message}"\n📄 Datei: ${fileName} (Zeile: ${event.lineno})`;
        
        // Füge die neue Fehlermeldung ganz oben im Container ein
        errorLogContainer.prepend(errorMessageElement);
    });
    
    // === TEST-FUNKTION FÜR DAS FEHLER-TOOL ===
    const errorTestButton = document.getElementById('errorTestButton');
    errorTestButton.addEventListener('click', () => {
        console.log("Löse absichtlich einen Fehler aus...");
        // Wir rufen eine Funktion auf, die es nicht gibt, um einen Fehler zu provozieren.
        eineFunktionDieNichtExistiert();
    });


    try {
        // === GRUNDSETUP DER SIMULATION ===
        console.log("FTS Simulation wird initialisiert...");
        const canvas = document.getElementById('simulationCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;
        ctx.fillStyle = '#e9e9e9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'blue';
        ctx.font = '20px Arial';
        ctx.fillText('Schritt 1 abgeschlossen: Grundgerüst mit Fehler-Tool steht!', 50, 50);
        console.log("Canvas und Kontext sind bereit.");

    } catch (error) {
        // Dieser 'catch'-Block wird nun ebenfalls Fehler im Web-Tool anzeigen
        const event = new ErrorEvent('error', {
            error: error,
            message: `Schwerer Initialisierungsfehler: ${error.message}`,
            filename: 'script.js',
            lineno: 0 // Zeilennummer ist hier nicht genau, aber der Kontext ist klar
        });
        window.dispatchEvent(event);
    }
});
