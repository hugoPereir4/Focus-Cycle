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