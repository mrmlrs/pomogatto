// Types
type Mode = "focus" | "break" | "long-break";
const API_URL = "http://localhost:3000";

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
    focusDuration: 25 * 60,
    breakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
};

// DOM
const timerDisplay = document.getElementById("timer")!;
const modeDisplayer = document.getElementById("mode")!;

const startButton = document.getElementById("start")!;
const pauseButton = document.getElementById("pause")!;
const stopButton = document.getElementById("stop")!;
const saveButton = document.getElementById("save")!;

const focusInput = document.getElementById("focusDuration")! as HTMLInputElement;
const breakInput = document.getElementById("breakDuration")! as HTMLInputElement;
const longBreakInput = document.getElementById("longBreakDuration")! as HTMLInputElement;

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
    timerState.duration = timerState.focusDuration;
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

function nextMode(): void {
    if (timerState.currentMode === "focus") {
        timerState.focusCount += 1;
        fetch(`${API_URL}/api/sessions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                duration: timerState.focusDuration / 60,
                status: "completed",
            }),
        });
        if (timerState.focusCount % 3 !== 0) {
            timerState.currentMode = "break";
            timerState.duration = timerState.breakDuration;
        } else {
            timerState.currentMode = "long-break";
            timerState.duration = timerState.longBreakDuration;
        }
    }
    else if (timerState.currentMode === "break" || timerState.currentMode === "long-break") {
        timerState.currentMode = "focus";
        timerState.duration = timerState.focusDuration;
    }
    timerState.timeRemaining = timerState.duration;
    modeDisplayer.textContent = timerState.currentMode;
    timerState.isRunning = false;
    startTimer();
}

function loadSettings(): void {
    const focus = localStorage.getItem("focusDuration");
    const pause = localStorage.getItem("breakDuration");
    const longBreak = localStorage.getItem("longBreakDuration");
    if (focus !== null) {
        timerState.focusDuration = parseInt(focus, 10);
    }
    if (pause !== null) {
        timerState.breakDuration = parseInt(pause, 10);
    }
    if (longBreak !== null) {
        timerState.longBreakDuration = parseInt(longBreak, 10);
    }
    focusInput.value = String(timerState.focusDuration / 60);
    breakInput.value = String(timerState.breakDuration / 60);
    longBreakInput.value = String(timerState.longBreakDuration / 60);
    timerState.duration = timerState.focusDuration;
    timerState.timeRemaining = timerState.duration;
}

function saveSettings(): void {
    const focusValue = focusInput.value;
    const breakValue = breakInput.value;
    const longBreakValue = longBreakInput.value;

    const focus = parseInt(focusValue, 10);
    const pause = parseInt(breakValue, 10);
    const longBreak = parseInt(longBreakValue, 10);

    if (isNaN(focus) || focus < 1 || focus > 120 ||
        isNaN(pause) || pause < 1 || pause > 120 ||
        isNaN(longBreak) || longBreak < 1 || longBreak > 120) {
        return;
    }
    localStorage.setItem("focusDuration", String(focus * 60));
    localStorage.setItem("breakDuration", String(pause * 60));
    localStorage.setItem("longBreakDuration", String(longBreak * 60));

    timerState.focusDuration = focus * 60;
    timerState.breakDuration = pause * 60;
    timerState.longBreakDuration = longBreak * 60;

    if (!timerState.isRunning) {
        timerState.duration = timerState.focusDuration;
        timerState.timeRemaining = timerState.focusDuration;
        timerDisplay.textContent = formatTime(timerState.timeRemaining);
    }
}

// Init
loadSettings();
timerDisplay.textContent = formatTime(timerState.timeRemaining);
modeDisplayer.textContent = timerState.currentMode;

// Events
startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
pauseButton.addEventListener("click", pauseTimer);
saveButton.addEventListener("click", saveSettings);