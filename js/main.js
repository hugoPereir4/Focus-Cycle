import { createTimer } from "./timer.js";
import { initUI, updateDisplay, updateRing, updatePhase } from "./ui.js";
import { playStart, playPause, playComplete } from "./sound.js";
import { saveSession, getStats, loadHistory } from "./storage.js";

document.addEventListener('DOMContentLoaded', () => {
    console.log('[FocusCycle] main.js carregado com ES Module ✓');

    initUI();
    initThemeToggle();
    initTimer();
    updateHistoryUI();
});

function updateHistoryUI() {
    const history = getStats();

    document.getElementById('sessions-count').textContent = history.sessions;
    document.getElementById('focus-time').textContent = `${history.totalMinutes} min`;

    const sessions = loadHistory();
    renderSessionList(sessions);
}

function initTimer() {
    const btnStart = document.getElementById('btn-start');
    const btnPause = document.getElementById('btn-pause');
    const btnReset = document.getElementById('btn-reset');

    const durationBtns = document.querySelectorAll('.btn-duration');

    let currentDuration = 25;

    durationBtns.forEach(button => {
        button.addEventListener('click', () => {
            currentDuration = Number(button.dataset.duration);
            durationBtns.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            timer.setDuration(currentDuration);
        });
    });

    const timer = createTimer({
        minutes: currentDuration,
        onTick: ({ minutes, seconds }) => {
            const fraction = (minutes * 60 + seconds) / (currentDuration * 60);

            updateDisplay({ minutes, seconds });
            updateRing(fraction);
        },
        onComplete: () => {
            updateDisplay({ minutes: 0, seconds: 0 });
            updateRing(0);
            syncButtonUI();
            playComplete();
            
            if (currentDuration === 25) {
                saveSession(currentDuration);
                updateHistoryUI();
            } else {
                console.log(`[FocusCycle] Sessão de ${currentDuration} minutos concluída. Não será salva.`);
            }
        }
    });


    function syncButtonUI() {
        const state = timer.getState();

        btnStart.disabled = state !== 'idle';
        btnReset.disabled = state === 'idle';
        btnPause.disabled = state === 'idle';
        btnPause.textContent = state === 'paused' ? 'Resumir' : 'Pausar';

        durationBtns.forEach(btn => {
            btn.disabled = state !== 'idle';
        });
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

function renderSessionList(sessions) {
    const listContainer = document.getElementById('session-list');
    listContainer.innerHTML = ''; // ← fora do forEach

    if (sessions.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.className = 'session-empty';
        emptyItem.textContent = 'Nenhuma sessão registrada ainda.';
        listContainer.appendChild(emptyItem);
        return;
    }

    sessions.forEach(session => {
        const date = new Date(session.completedAt);
        const hours = String(date.getHours()).padStart(2, '0');
        const mins = String(date.getMinutes()).padStart(2, '0');
        const time = `${hours}:${mins}`;

        const li = document.createElement('li');
        li.className = 'session-item';
        li.innerHTML = `
            <span class="session-item__time">${time}</span>
            <span class="session-item__duration">${session.minutes} min</span>
        `;
        listContainer.appendChild(li);
    });
}