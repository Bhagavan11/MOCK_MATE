import React, { useState } from "react";
import { useInterviewStore } from "../store";

export default function Evaluation() {
  const { evaluation } = useInterviewStore();
  const [index, setIndex] = useState(0);

  if (!evaluation || !evaluation.evaluations || evaluation.evaluations.length === 0) {
    return null; // Nothing to show
  }

  const parts = evaluation.evaluations; // ✅ This is your new array
  const current = parts[index];

  return (
    <div className="evaluation-container">
      <h2 className="evaluation-title">Evaluation Result</h2>

      <div className="evaluation-card">
        <p><strong>Question:</strong> {current.question}</p>
        <p><strong>Your Answer:</strong> {current.yourAnswer}</p>
        <p><strong>Feedback:</strong> {current.feedback}</p>
        <p><strong>Score:</strong> {current.score}/10</p>
      </div>

      <div className="evaluation-controls">
        <button
          className="btn-primary"
          onClick={() => setIndex((prev) => prev - 1)}
          disabled={index === 0}
        >
          Previous
        </button>

        <button
          className="btn-primary"
          onClick={() => setIndex((prev) => prev + 1)}
          disabled={index >= parts.length - 1}
        >
          Next
        </button>
      </div>

      <div className="evaluation-progress">
        {index + 1} of {parts.length}
      </div>

      {index === parts.length - 1 && (
        <div className="overall-score">
          <p><strong>Overall Score:</strong> {evaluation.overallScore}/100</p>
        </div>
      )}
    </div>
  );
}
