export function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  speechSynthesis.speak(utterance);
}

export function useSpeechToText(setAnswer) {
  let recognition;

  if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = true;
  } else {
    console.error("Speech recognition not supported in this browser");
  }

  const startListening = () => {
    if (!recognition) return;
    recognition.start();
  };

  const stopListening = () => {
    if (!recognition) return;
    recognition.stop();
  };

  if (recognition) {
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setAnswer(prev => `${prev} ${speechResult}`.trim()); // Append if needed
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };
  }

  return { startListening, stopListening };
}
