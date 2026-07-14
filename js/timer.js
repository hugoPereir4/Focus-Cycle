const TRANSITIONS = {
    idle: {
        start: 'running',
        reset: 'idle'
    },
    running: {
        pause: 'paused',
        complete: 'idle',
        reset: 'idle'
    },
    paused: {
        resume: 'running',
        reset: 'idle'
    }
};

export function createTimer({ minutes = 25, onTick, onComplete } = {}) {

    let currentMinutes = minutes;
    let state = 'idle';
    let endTime = null;
    let remainingMs = currentMinutes * 60 * 1000;
    let intervalId = null;

    function resolveTransition(action) {
        return TRANSITIONS[state]?.[action] ?? null;
    }

    function stopInterval() {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    function msToDisplay(ms) {
        const totalSeconds = Math.max(0, Math.round(ms / 1000));
        return {
            minutes: Math.floor(totalSeconds / 60),
            seconds: totalSeconds % 60
        };
    }

    function tick() {
        const remaining = endTime - Date.now();

        if (remaining <= 0 ) {
            stopInterval();
            state = resolveTransition('complete');
            remainingMs = currentMinutes * 60 * 1000;

            onTick?.(msToDisplay(0));
            onComplete?.();
            return;
        }

        remainingMs = remaining;
        onTick?.(msToDisplay(remaining));
    }

    function start() {
        const next = resolveTransition('start');
        if (!next) return;

        state = next;
        endTime = Date.now() + remainingMs;
        intervalId = setInterval(tick, 100);
        tick();
    }

    function pause() {
        const next = resolveTransition('pause');
        if (!next) return;

        stopInterval();
        remainingMs = endTime - Date.now();
        state = next;
    }

    function resume() {
        const next = resolveTransition('resume');
        if (!next) return;

        state = next;
        endTime = Date.now() + remainingMs;
        intervalId = setInterval(tick, 100);
        tick();
    }

    function reset() {
        const next = resolveTransition('reset');
        if (!next) return;

        stopInterval();
        state = next;
        remainingMs = currentMinutes * 60 * 1000;
        endTime = null;

        onTick?.(msToDisplay(remainingMs));
    }

    function getState() {
        return state;
    }

    function setDuration(newMinutes) {
        const next = resolveTransition('reset');
        if (!next) return;

        currentMinutes = newMinutes;
        stopInterval();
        state = next;
        remainingMs = currentMinutes * 60 * 1000;
        endTime = null;
        
        onTick?.(msToDisplay(remainingMs));
    }

    return { start, pause, resume, reset, getState, setDuration };
}