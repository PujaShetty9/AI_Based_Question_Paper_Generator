import { useState } from "react";
import "./App.css";

function App() {
  const [loading, setLoading] = useState("");
  const [subject, setSubject] = useState("Database Management System");
  const [topics, setTopics] = useState("DBMS Basics, ER Model, Normalization, SQL, Transactions");
  const [difficulty, setDifficulty] = useState("Medium");
  const [bloomsLevel, setBloomsLevel] = useState("Understand");
  const [totalMarks, setTotalMarks] = useState(70);
  const [paperText, setPaperText] = useState(
    "Section A\n1. What is DBMS?\n2. Define normalization.\n\nSection B\n1. Explain ER model.\n\nSection C\n1. Explain concurrency control."
  );

  const API_BASE_URL = "http://127.0.0.1:5000";

  const downloadFile = async (url, body, filename) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorMessage = "Something went wrong";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = "Failed to download PDF";
      }
      throw new Error(errorMessage);
    }

    const blob = await response.blob();
    const fileURL = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = fileURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(fileURL);
  };

  const handleDownloadQuestionPaper = async () => {
    try {
      setLoading("question-paper");

      const topicsArray = topics
        .split(",")
        .map((topic) => topic.trim())
        .filter((topic) => topic !== "");

      await downloadFile(
        `${API_BASE_URL}/download-question-paper`,
        {
          subject,
          topics: topicsArray,
          difficulty,
          blooms_level: bloomsLevel,
          total_marks: Number(totalMarks),
        },
        "ai_question_paper.pdf"
      );

      alert("Question Paper PDF downloaded successfully.");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading("");
    }
  };

  const handleDownloadAnswerKey = async () => {
    try {
      setLoading("answer-key");

      await downloadFile(
        `${API_BASE_URL}/download-answer-key`,
        {
          subject,
          paper: paperText,
        },
        "ai_answer_key.pdf"
      );

      alert("Answer Key PDF downloaded successfully.");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="app-container">
      <div className="pdf-card">
        <h1>AI Question Paper Generator</h1>
        <p className="subtitle">Test PDF generation from your Flask backend</p>

        <div className="form-group">
          <label>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Topics (comma separated)</label>
          <textarea
            rows="3"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
          />
        </div>

        <div className="row">
          <div className="form-group">
            <label>Difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label>Bloom's Level</label>
            <select value={bloomsLevel} onChange={(e) => setBloomsLevel(e.target.value)}>
              <option value="Remember">Remember</option>
              <option value="Understand">Understand</option>
              <option value="Apply">Apply</option>
              <option value="Analyze">Analyze</option>
              <option value="Evaluate">Evaluate</option>
              <option value="Create">Create</option>
            </select>
          </div>

          <div className="form-group">
            <label>Total Marks</label>
            <input
              type="number"
              value={totalMarks}
              onChange={(e) => setTotalMarks(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Paper Text (for Answer Key PDF)</label>
          <textarea
            rows="10"
            value={paperText}
            onChange={(e) => setPaperText(e.target.value)}
          />
        </div>

        <div className="button-group">
          <button
            onClick={handleDownloadQuestionPaper}
            disabled={loading === "question-paper"}
          >
            {loading === "question-paper"
              ? "Downloading Question Paper..."
              : "Download Question Paper PDF"}
          </button>

          <button
            onClick={handleDownloadAnswerKey}
            disabled={loading === "answer-key"}
          >
            {loading === "answer-key"
              ? "Downloading Answer Key..."
              : "Download Answer Key PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;