export const speak = (text) => {
  if ("speechSynthesis" in window) {
    const voices = speechSynthesis.getVoices();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    const selectedVoice = voices.find((voice) =>
      voice.lang.toUpperCase().includes("IN")
    );
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    // Adjust speed (1.0 is normal speed)
    speechSynthesis.speak(utterance);
  } else {
    console.error("Speech synthesis not supported in this browser");
  }
};
