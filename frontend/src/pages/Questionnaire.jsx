import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Questionnaire = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Load all questions
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/questions`)
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error("Error fetching questions:", err))
      .finally(() => setLoading(false));
  }, []);

  // Submit answers
  const handleSubmit = () => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/questionnaire/submit`, {
        userName: "Guest",
        answers,
      })
      .then((res) => setResult(res.data))
      .catch((err) => console.error("Submit error:", err));
  };

  return (
    <div className="container mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg p-8">

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-center mb-10">
          🧠 Career Discovery Questionnaire
        </h1>

        {/* CREATE QUESTION BUTTON */}
        <div className="mb-10 text-center">
          <button
            onClick={() => navigate("/create-question")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-green-700 transition"
          >
            ➕ Create New Question
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center text-lg font-semibold py-10">
            Loading questions...
          </div>
        )}

        {/* QUIZ SECTION */}
        {!loading && !result && (
          <div className="max-w-2xl mx-auto">
            {questions.map((q) => (
              <div key={q._id} className="mb-6 bg-gray-50 p-6 rounded-lg shadow-md">
                <p className="text-lg font-semibold mb-4">{q.question}</p>

                {q.options.map((opt, idx) => (
                  <label key={idx} className="block mb-2">
                    <input
                      type="radio"
                      name={q._id}
                      value={opt.text}
                      onChange={(e) =>
                        setAnswers({ ...answers, [q._id]: e.target.value })
                      }
                      className="mr-2"
                    />
                    {opt.text}
                  </label>
                ))}
              </div>
            ))}

            <div className="text-center">
              <button
                onClick={handleSubmit}
                className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition"
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* RESULT */}
        {result && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Your Score: {result.score} / {result.total}
            </h2>
            <p className="text-lg">
              Great job! Keep learning and improving your skills.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;