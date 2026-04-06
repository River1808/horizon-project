import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Questionnaire.css"; // <-- NEW CSS FILE YOU WILL CREATE

const Questionnaire = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId] = useState(() => {
    return typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `user-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  });

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
              const questionId = q._id || q.id;
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
          <div className="result-container">

            <h2 className="result-title">Your Assessment Results</h2>

            {/* MAIN & SECONDARY */}
            <div className="result-highlights">
              <div className="card main">
                <h3>Main Interest</h3>
                <p>{result.mainField}</p>
              </div>

              <div className="card secondary">
                <h3>Secondary Interest</h3>
                <p>{result.secondaryField}</p>
              </div>
            </div>

            {/* SCORES */}
            <div className="score-box">
              <h3>Your Scores</h3>

              {Object.entries(result.scores).map(([category, score]) => (
                <div key={category} className="score-row">
                  <span className="category">{category}</span>

                  <div className="progress">
                    <div
                      className="progress-fill"
                      style={{ width: `${score * 5}%` }}
                    ></div>
                  </div>

                  <span className="points">{score} pts</span>
                </div>
              ))}
            </div>

            {/* INTERPRETATION */}
            <div className="interpretation-box">
              <h3>Interpretation Guide</h3>

              <div className="guide-grid">
                <div>
                  <strong>Science</strong>
                  <p>Analytical thinking, research, problem-solving</p>
                </div>

                <div>
                  <strong>Technology</strong>
                  <p>Innovation, programming, digital tools</p>
                </div>

                <div>
                  <strong>Engineering</strong>
                  <p>Design, building, technical solutions</p>
                </div>

                <div>
                  <strong>Arts</strong>
                  <p>Creativity, communication, design</p>
                </div>

                <div>
                  <strong>Math</strong>
                  <p>Logic, patterns, quantitative analysis</p>
                </div>
              </div>

              <p className="note">
                Higher scores indicate stronger interests in those areas. Use this to explore related careers and educational paths.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;