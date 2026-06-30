import { createTimer } from "./timer.js";

document.addEventListener('DOMContentLoaded', () => {
    console.log('[FocusCycle] main.js carregado com ES Module ✓');

    initThemeToggle();
    initTimer();
});

function initTimer() {
    const timer = createTimer({
        minutes: 25,
        onTick: ({ minutes, seconds }) => {
            //implementado apenas no console, implementação com UI pendente.
            const mm = String(minutes).padStart(2, '0');
            const ss = String(seconds).padStart(2, '0');
            console.log(`[tick] ${mm}:${ss} | state: ${timer.getState()}`);
        },
        onComplete: () => {
            console.log('[FocusCycle] Sessão concluída!');
        }
    });

    const btnStart = document.getElementById('btn-start');
    const btnPause = document.getElementById('btn-pause');
    const btnReset = document.getElementById('btn-reset');

    btnStart.addEventListener('click', () => {
        timer.start();

        btnStart.disabled = true;
        btnPause.disabled = false;
        btnReset.disabled = false;
    });
    btnPause.addEventListener('click', () => {
        if (timer.getState() === 'paused') {
            timer.resume();
            document.getElementById('btn-pause').innerText = "Pausar"
        } else {
            timer.pause();
            document.getElementById('btn-pause').innerText = "Resumir"
        }

        btnStart.disabled = true;
        btnPause.disabled = false;
        btnReset.disabled = false;
    });
    btnReset.addEventListener('click', () => {
        timer.reset();

        btnStart.disabled = false;
        btnPause.disabled = true;
        btnReset.disabled = true;
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