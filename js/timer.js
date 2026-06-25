const TRANSITIONS = {
    idle: {
        start: 'running'
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

    let state = 'idle';
    let endTime = null;
    let remainingMs = minutes * 60 * 1000;
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
            remainingMs = minutes * 60 * 1000;

            onTick?.(msToDisplay(0));
            onComplete?.();
            return;
        }

        remainingMs = remaining;
        onTick?.(msToDisplay(remaining));
    }
}