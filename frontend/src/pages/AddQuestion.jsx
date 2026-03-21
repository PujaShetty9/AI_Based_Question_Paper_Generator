import { useEffect, useState } from "react";
import API from "../services/api";

function AddQuestion() {
  const [subjects, setSubjects] = useState([]);
  const [units, setUnits] = useState([]);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    subject_id: "",
    unit_id: "",
    question_text: "",
    question_type: "SHORT",
    difficulty_level: "EASY",
    blooms_level: "UNDERSTAND",
    marks: "",
    answer_text: "",
    evaluation_scheme: "",
    keywords: ""
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await API.get("/subjects");
      setSubjects(response.data.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchUnits = async (subjectId) => {
    try {
      const response = await API.get(`/syllabus-units/${subjectId}`);
      setUnits(response.data.data);
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === "subject_id") {
      setFormData((prev) => ({
        ...prev,
        subject_id: value,
        unit_id: ""
      }));
      fetchUnits(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const payload = {
        ...formData,
        subject_id: Number(formData.subject_id),
        unit_id: Number(formData.unit_id),
        marks: Number(formData.marks)
      };

      const response = await API.post("/add-question", payload);

      setMessage(response.data.message);

      setFormData({
        subject_id: "",
        unit_id: "",
        question_text: "",
        question_type: "SHORT",
        difficulty_level: "EASY",
        blooms_level: "UNDERSTAND",
        marks: "",
        answer_text: "",
        evaluation_scheme: "",
        keywords: ""
      });

      setUnits([]);
    } catch (error) {
      console.error(error);
      setMessage("Failed to add question");
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Add Question</h1>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px", maxWidth: "700px" }}>
        <select name="subject_id" value={formData.subject_id} onChange={handleChange} required>
          <option value="">Select Subject</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>

        <select name="unit_id" value={formData.unit_id} onChange={handleChange} required>
          <option value="">Select Unit</option>
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.unit_name} - {unit.topic_name}
            </option>
          ))}
        </select>

        <textarea
          name="question_text"
          placeholder="Enter question"
          value={formData.question_text}
          onChange={handleChange}
          required
        />

        <select name="question_type" value={formData.question_type} onChange={handleChange}>
          <option value="MCQ">MCQ</option>
          <option value="SHORT">SHORT</option>
          <option value="LONG">LONG</option>
          <option value="CASE">CASE</option>
        </select>

        <select name="difficulty_level" value={formData.difficulty_level} onChange={handleChange}>
          <option value="EASY">EASY</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HARD">HARD</option>
        </select>

        <select name="blooms_level" value={formData.blooms_level} onChange={handleChange}>
          <option value="REMEMBER">REMEMBER</option>
          <option value="UNDERSTAND">UNDERSTAND</option>
          <option value="APPLY">APPLY</option>
          <option value="ANALYZE">ANALYZE</option>
          <option value="EVALUATE">EVALUATE</option>
          <option value="CREATE">CREATE</option>
        </select>

        <input
          type="number"
          name="marks"
          placeholder="Marks"
          value={formData.marks}
          onChange={handleChange}
          required
        />

        <textarea
          name="answer_text"
          placeholder="Model answer"
          value={formData.answer_text}
          onChange={handleChange}
        />

        <textarea
          name="evaluation_scheme"
          placeholder="Evaluation scheme"
          value={formData.evaluation_scheme}
          onChange={handleChange}
        />

        <input
          type="text"
          name="keywords"
          placeholder="Keywords separated by commas"
          value={formData.keywords}
          onChange={handleChange}
        />

        <button type="submit">Add Question</button>
      </form>
    </div>
  );
}

export default AddQuestion;