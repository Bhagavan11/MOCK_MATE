import React from "react";
import UploadResume from "./components/UploadResume";
import Questions from "./components/Questions";
import SubmitAnswers from "./components/SubmitAnswers";
import Evaluation from "./components/Evaluation";
import { useInterviewStore } from "./store";
import { Toaster } from "react-hot-toast";
import "./App.css";

export default function App() {
  const loading = useInterviewStore((s) => s.loading);
  const questions = useInterviewStore((s) => s.questions);
  const reset = useInterviewStore((s) => s.reset);

  return (
    <div className="container">
      {/* ✅ HOME BUTTON */}
      <button
        onClick={reset}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          background: "#444",
          color: "#fff",
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
      Home
      </button>

      <h1>Mock Interview</h1>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <div className="loading-text">{loading}</div>
        </div>
      )}

      {!questions.length && <UploadResume />}
      {questions.length > 0 && (
        <>
          <Questions />
          <SubmitAnswers />
        </>
      )}
      <Evaluation />
      <Toaster />
    </div>
  );
}
