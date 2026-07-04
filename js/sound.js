let audioContext = null;

function getContext() {
    if (audioContext === null) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        return audioContext;
    } else if (audioContext.state === 'suspended') {
        audioContext.resume();
        return audioContext;
    } else {
        return audioContext;
    }
}

function playBeep(frequency, duration, type, volume) {
    const context = getContext();
    const oscillatorNode = context.createOscillator();
    const gainNode = context.createGain();

    oscillatorNode.connect(gainNode);
    gainNode.connect(context.destination);

    oscillatorNode.frequency.value = frequency;
    oscillatorNode.type = type;
    gainNode.gain.value = volume;

    gainNode.gain.setValueAtTime(volume, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + duration);

    oscillatorNode.start();
    oscillatorNode.stop(context.currentTime + duration);
}

export function playStart() {
    playBeep(440, 0.1, 'sine', 0.5);
    setTimeout(() => playBeep(660, 0.2, 'sine', 0.6), 200);
}

export function playComplete() {
    playBeep(880, 0.1, 'sine', 0.5);
    setTimeout(() => playBeep(1100, 0.2, 'sine', 0.6), 200);
}

export function playPause() {
    playBeep(220, 0.1, 'sine', 0.5);
    setTimeout(() => playBeep(330, 0.2, 'sine', 0.6), 200);
}