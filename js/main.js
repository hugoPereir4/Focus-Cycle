import { createTimer } from "./timer.js";
import { initUI, updateDisplay, updateRing, updatePhase } from "./ui.js";
import { playStart, playPause, playComplete } from "./sound.js";

document.addEventListener('DOMContentLoaded', () => {
    console.log('[FocusCycle] main.js carregado com ES Module ✓');

    initUI();
    initThemeToggle();
    initTimer();
});

function initTimer() {
    const btnStart = document.getElementById('btn-start');
    const btnPause = document.getElementById('btn-pause');
    const btnReset = document.getElementById('btn-reset');

    const focusMinutes = 25;

    const timer = createTimer({
        minutes: focusMinutes,
        onTick: ({ minutes, seconds }) => {
            const fraction = (minutes * 60 + seconds) / (focusMinutes * 60);

            updateDisplay({ minutes, seconds });
            updateRing(fraction);
        },
        onComplete: () => {
            updateDisplay({ minutes: 0, seconds: 0 });
            updateRing(0);
            syncButtonUI();
            playComplete();
        }
    });


    function syncButtonUI() {
        const state = timer.getState();

        btnStart.disabled = state !== 'idle';
        btnReset.disabled = state === 'idle';
        btnPause.disabled = state === 'idle';
        btnPause.textContent = state === 'paused' ? 'Resumir' : 'Pausar';
    }

    btnStart.addEventListener('click', () => {
        timer.start();

        syncButtonUI();
        playStart();
    });
    btnPause.addEventListener('click', () => {
        if (timer.getState() === 'paused') {
            timer.resume();
        } else {
            timer.pause();
        }

        syncButtonUI();
        playPause();
    });
    btnReset.addEventListener('click', () => {
        timer.reset();

        syncButtonUI();
    });
}

function initThemeToggle() {
    const html = document.documentElement;
    const button = document.getElementById('theme-toggle');

    if (!button) {
        console.warn('[FocusCycle] Botão de tema não encontrado.');
        return;
    }

    const savedTheme = localStorage.getItem('focuscycle-theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    }

    button.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', next);

        localStorage.setItem('focuscycle-theme', next);

        console.log(`[FocusCycle] tema alterado para: ${next}`);
    })
}