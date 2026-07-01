let timerMinutes, timerSeconds, progressArc, phaseLabel, circumference;

export function initUI() {
    timerMinutes = document.getElementById('timer-minutes');
    timerSeconds = document.getElementById('timer-seconds');
    progressArc = document.getElementById('progress-arc');
    phaseLabel = document.getElementById('phase-label');
    circumference = progressArc.getTotalLength();
}

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