export function setupAudio({ bgm, endgameMusic, muteBtn }) {
    // Start music after user interaction (browser rule)
    window.addEventListener("click", () => {
        if (bgm.paused) bgm.play();
        endgameMusic.muted = bgm.muted;
    }, { once: true });

    const updateIcon = () => {
        muteBtn.textContent = bgm.muted ? "🔇" : "🔊";
        muteBtn.classList.toggle("muted", bgm.muted);
    };

    const toggleMute = () => {
        bgm.muted = !bgm.muted;
        endgameMusic.muted = bgm.muted;
        updateIcon();
    };

    muteBtn.addEventListener("click", toggleMute);

    // Initialize icon state
    updateIcon();

    const syncEndgameMute = () => {
        endgameMusic.muted = bgm.muted;
    };

    return { toggleMute, syncEndgameMute };
}
