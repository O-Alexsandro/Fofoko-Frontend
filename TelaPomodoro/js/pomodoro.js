let timer;
let minutes = 25; // Tempo inicial de trabalho (25 minutos)
let seconds = 0;
let isBreakTime = false;
let pomodoroCount = 0;

const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const statusText = document.getElementById('statusText');

function startTimer() {
    startButton.disabled = true;
    pauseButton.disabled = false;
    resetButton.disabled = false;

    timer = setInterval(updateTimer, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    startButton.disabled = false;
    pauseButton.disabled = true;
}

function resetTimer() {
    clearInterval(timer);
    minutes = 25;
    seconds = 0;
    isBreakTime = false;
    pomodoroCount = 0;

    updateTimerDisplay();
    startButton.disabled = false;
    pauseButton.disabled = true;
    statusText.textContent = 'Work Time';
}

function updateTimer() {
    if (seconds > 0) {
        seconds--;
    } else if (minutes > 0) {
        seconds = 59;
        minutes--;
    } else {
        clearInterval(timer);
        if (isBreakTime) {
            pomodoroCount++;
            if (pomodoroCount < 4) {
                minutes = 25; // Próximo ciclo de trabalho
                seconds = 0;
                isBreakTime = false;
                statusText.textContent = 'Work Time';
            } else {
                minutes = 15; // Pausa longa após 4 ciclos de trabalho
                seconds = 0;
                isBreakTime = true;
                pomodoroCount = 0;
                statusText.textContent = 'Long Break';
            }
        } else {
            minutes = 5; // Pausa curta após um ciclo de trabalho
            seconds = 0;
            isBreakTime = true;
            statusText.textContent = 'Short Break';
        }
        updateTimerDisplay();
        startButton.disabled = false;
        pauseButton.disabled = true;
    }

    updateTimerDisplay();
}

function updateTimerDisplay() {
    minutesDisplay.textContent = minutes < 10 ? '0' + minutes : minutes;
    secondsDisplay.textContent = seconds < 10 ? '0' + seconds : seconds;
}
