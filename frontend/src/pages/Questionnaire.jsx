import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Questionnaire.css"; // <-- NEW CSS FILE YOU WILL CREATE

const Questionnaire = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/questions`)
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error("Error fetching questions:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleOptionChange = (questionId, optionIndex) => {
    setAnswers(prev => {
      const existingIndex = prev.findIndex(a => a.questionId === questionId);
      if (existingIndex !== -1) {
        const newAnswers = [...prev];
        newAnswers[existingIndex] = { questionId, selectedOptionIndex: optionIndex };
        return newAnswers;
      } else {
        return [...prev, { questionId, selectedOptionIndex: optionIndex }];
      }
    });
  };

  const handleSubmit = () => {
    const userId = "guest"; // Assuming guest user
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/responses`, {
        userId,
        answers,
      })
      .then(() => {
        // After submitting, fetch the result
        return axios.get(`${import.meta.env.VITE_API_URL}/api/results/${userId}`);
      })
      .then((res) => setResult(res.data))
      .catch((err) => console.error("Submit or fetch result error:", err));
  };

  return (
    <div className="questionnaire-page">

      {/* ⭐ HERO SECTION */}
      <section className="questionnaire-hero">
        <div className="hero-text">
          <h1>Khám phá hướng đi nghề nghiệp của bạn</h1>
          <p>Trả lời các câu hỏi để tìm ra thế mạnh & sở thích của bạn.</p>
        </div>

        <div className="hero-img">
          <img src="/questionnaire.svg" alt="questionnaire" />
        </div>
      </section>

      {/* MAIN CARD */}
      <div className="questionnaire-container">

        {/* ADMIN BUTTONS */}
        <div className="admin-buttons">
          <button onClick={() => navigate("/create-question")} className="green-btn">
            ➕ Create New Question
          </button>

          <button onClick={() => navigate("/admin/questions")} className="blue-btn">
            ✏️ Edit Questions
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="loading-text">Loading questions...</div>
        )}

        {/* QUESTION LIST */}
        {!loading && !result && (
          <div className="question-list">
            {questions.map((q) => {
              const questionId = q.id || q._id;
              return (
                <div key={questionId} className="question-card">
                  <p className="question-title">{q.question}</p>

                  {q.options.map((opt, idx) => (
                    <label key={idx} className="option-item">
                      <input
                        type="radio"
                        name={questionId}
                        checked={answers.find(a => a.questionId === questionId)?.selectedOptionIndex === idx}
                        onChange={() => handleOptionChange(questionId, idx)}
                      />
                      {opt.text}
                    </label>
                  ))}
                </div>
              );
            })}

            <div className="submit-wrapper">
              <button onClick={handleSubmit} className="submit-btn">
                Submit
              </button>
            </div>
          </div>
        )}

        {/* RESULT */}
        {result && (
          <div className="result-box">
            <h2>Your Main Field: {result.mainField}</h2>
            <p>Secondary Field: {result.secondaryField}</p>
            <p>Career Suggestion: {result.careerSuggestion}</p>
            <div>
              <h3>Scores:</h3>
              <ul>
                {Object.entries(result.scores).map(([category, score]) => (
                  <li key={category}>{category}: {score}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;