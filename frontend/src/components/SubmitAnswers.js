import React from "react";
import { useInterviewStore } from "../store";

export default function SubmitAnswers() {
  const { answers, submitAnswers } = useInterviewStore();

  if (!answers.length) return null;

  return (
    <div className="submit-answers-container">
      <p className="submit-summary">
        You have answered {answers.length} question{answers.length > 1 ? "s" : ""}.
      </p>
      <button className="btn-primary" onClick={submitAnswers}>
        Submit All Answers
      </button>
    </div>
  );
}
