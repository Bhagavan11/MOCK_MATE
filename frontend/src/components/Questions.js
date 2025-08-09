import React, { useState } from "react";
import { useInterviewStore } from "../store";
import { useSpeechToText, speak } from "../lib/speak";

export default function Questions() {
  const { questions, currentIndex, addAnswer, nextQuestion } = useInterviewStore();
  const [answer, setAnswer] = useState("");

  // Voice read states
  const [isReading, setIsReading] = useState(false);
  // Mic listen states
  const [isListening, setIsListening] = useState(false);

  const { startListening, stopListening } = useSpeechToText(setAnswer);

  if (questions.length === 0) return <p className="placeholder">No questions yet.</p>;
  if (currentIndex >= questions.length) return <p className="placeholder">✅ All questions answered.</p>;

  const q = questions[currentIndex];

  const handleSpeak = () => {
    setIsReading(true);
    speak(q, () => setIsReading(false)); // Pass callback when reading ends
  };

  const handleStopSpeak = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
  };

  const handleStartListening = () => {
    startListening();
    setIsListening(true);
  };

  const handleStopListening = () => {
    stopListening();
    setIsListening(false);
  };

  const handleNext = () => {
    if (!answer.trim()) return;
    addAnswer({ q, a: answer.trim() });
    setAnswer("");
    handleStopListening();
    handleStopSpeak();
    nextQuestion();
  };

  return (
    <div className="question-container">
      <div className="question-progress">
        Question {currentIndex + 1} of {questions.length}
      </div>

      <p className="question-text">{q}</p>

      <div className="controls">
        <button onClick={handleSpeak} disabled={isReading}>
          📢 Start Reading
        </button>
        <button onClick={handleStopSpeak} disabled={!isReading}>
          ⏹️ Stop Reading
        </button>

        {isReading && <div className="indicator reading">🔊 Reading...</div>}
      </div>

      <textarea
        className="answer-input"
        rows="5"
        placeholder="Type your answer..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <div className="controls">
        <button className="btn-primary" onClick={handleNext}>
          ✅ Submit Answer & Next
        </button>

        <button onClick={handleStartListening} disabled={isListening}>
          🎙️ Start Listening
        </button>
        <button onClick={handleStopListening} disabled={!isListening}>
          🛑 Stop Listening
        </button>

        {isListening && <div className="indicator listening">🎤 Listening...</div>}
      </div>
    </div>
  );
}
