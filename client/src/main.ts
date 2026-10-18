type Mode = "focus" | "break" | "long-break";

let timeRemaining: number = 25 * 60;
let currentMode: Mode = "focus";

const timerDisplay = document.getElementById("timer")!;
const modeDisplayer = document.getElementById("mode")!;
const startButton = document.getElementById("start")!;
const pauseButton = document.getElementById("pause")!;
const stopButton = document.getElementById("stop")!;

function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (secs < 10) {
        return `${minutes}:0${secs}`;
    }

    return `${minutes}:${secs}`;
}

timerDisplay.textContent = formatTime(timeRemaining);
modeDisplayer.textContent = currentMode;