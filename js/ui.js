const timerMinutes = document.getElementById('timer-minutes');
const timerSeconds = document.getElementById('timer-seconds');
const progressArc = document.getElementById('progress-arc');
const phaseLabel = document.getElementById('phase-label');

const circumference = progressArc.getTotalLength();

export function updateDisplay({ minutes, seconds }) {
    timerMinutes.textContent = String(minutes).padStart(2, '0');
    timerSeconds.textContent = String(seconds).padStart(2, '0');
}

export function updateRing(fraction) {
    const offset = circumference * (1 - fraction);
    progressArc.style.strokeDasharray = `${circumference} ${circumference}`;
    progressArc.style.strokeDashoffset = offset;
}

export function updatePhase(label) {
    phaseLabel.textContent = label;
}