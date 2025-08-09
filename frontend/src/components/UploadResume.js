import React, { useState } from "react";
import { useInterviewStore } from "../store";
import toast from "react-hot-toast";
export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [numQuestions, setNumQuestions] = useState(10);

  const uploadResume = useInterviewStore((s) => s.uploadResume);

  const handleUpload = () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    if (numQuestions < 1 || numQuestions > 20) {
      toast.error("Number of questions must be between 1 and 20.");
      return;
    }
    if ( !role) {
      toast.error("Please provide  role.");
      return;
    }
    uploadResume(file, company, role, numQuestions);
  };

  return (
    <div className="upload-container">
      <h2>Upload Resume</h2>

      <div className="form-row">
        <div className="form-group">
          <label>Company</label>
          <input
            type="text"
            placeholder="e.g. Google"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <input
            type="text"
            placeholder="e.g. Frontend Developer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Number of Questions(1-20)</label>
          <input
            type="number"
            min="1"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      </div>

      <button onClick={handleUpload}>Upload Resume</button>
    </div>
  );
}
