function getDayKey() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `focus-cycle-${year}-${month}-${day}`;
}

export function loadHistory() {
    try {
        const data = localStorage.getItem(getDayKey());
        return JSON.parse(data) || [];
        
    } catch (error) {
        console.error('[FocusCycle] Erro ao carregar o histórico:', error);
        return [];
    }
}

export function saveSession(minutes) {
    try {
        const history = loadHistory();
        history.push({ completedAt: Date.now(), minutes });
        localStorage.setItem(getDayKey(), JSON.stringify(history));
    } catch (error) {
        console.error('[FocusCycle] Erro ao salvar o histórico:', error);
    }
}

export function getStats() {
    const history = loadHistory();
    const sessions = history.length;
    const totalMinutes = history.reduce((sum, session) => sum + session.minutes, 0);
    return { sessions, totalMinutes };
}