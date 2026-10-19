// Types
type Mode = "focus" | "break" | "long-break";

// States
const timerState = {
    duration: 25 * 60,
    timeRemaining: 25 * 60,
    currentMode: "focus" as Mode,
    startTime: 0,
    intervalId: 0,
    isPaused: false,
    isRunning: false,
    focusCount: 0,
};

// DOM
const timerDisplay = document.getElementById("timer")!;
const modeDisplayer = document.getElementById("mode")!;
const startButton = document.getElementById("start")!;
const pauseButton = document.getElementById("pause")!;
const stopButton = document.getElementById("stop")!;

// Functions
function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (secs < 10) {
        return `${minutes}:0${secs}`;
    }

    return `${minutes}:${secs}`;
}

function startTimer(): void {
    if (timerState.isRunning === true && timerState.isPaused === false) {
        return;
    }
    clearInterval(timerState.intervalId);
    timerState.isRunning = true;
    if (timerState.isPaused === true) {
        timerState.startTime = Date.now() - (timerState.duration - timerState.timeRemaining) * 1000;
        timerState.isPaused = false;
    } else {
        timerState.startTime = Date.now();
    }
    timerDisplay.textContent = formatTime(timerState.timeRemaining);
    timerState.intervalId = setInterval(() => {
        timerState.timeRemaining = Math.floor(timerState.duration - (Date.now() - timerState.startTime) / 1000);
        if (timerState.timeRemaining <= 0) {
            nextMode();
            return;
        }
        timerDisplay.textContent = formatTime(timerState.timeRemaining);
    }, 100);
}

function stopTimer(): void {
    clearInterval(timerState.intervalId);
    timerState.isRunning = false;
    timerState.isPaused = false;
    timerState.currentMode = "focus";
    timerState.duration = 25 * 60;
    timerState.timeRemaining = timerState.duration;
    timerState.focusCount = 0;
    timerDisplay.textContent = formatTime(timerState.timeRemaining);
}

function pauseTimer(): void {
    if (!timerState.isRunning) {
        return;
    }
    clearInterval(timerState.intervalId);
    timerState.isPaused = true;
    timerState.isRunning = false;
}

function nextMode() {
    if (timerState.currentMode === "focus") {
        timerState.focusCount += 1;
        if (timerState.focusCount % 3 !== 0) {
            timerState.currentMode = "break";
            timerState.duration = 5 * 60;
        } else {
            timerState.currentMode = "long-break";
            timerState.duration = 15 * 60;
        }
    }
    else if (timerState.currentMode === "break" || timerState.currentMode === "long-break") {
        timerState.currentMode = "focus";
        timerState.duration = 25 * 60;
    }
    timerState.timeRemaining = timerState.duration;
    modeDisplayer.textContent = timerState.currentMode;
    timerState.isRunning = false;
    startTimer();
}

// Init
timerDisplay.textContent = formatTime(timerState.timeRemaining);
modeDisplayer.textContent = timerState.currentMode;

// Events
startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
pauseButton.addEventListener("click", pauseTimer);