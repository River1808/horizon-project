import { useEffect, useState } from "react";
import axios from "axios";

const Questionnaire = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // New Question State
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState([{ text: "", correct: false }]);

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

  // Add option
  const addOption = () => {
    setNewOptions([...newOptions, { text: "", correct: false }]);
  };

  // Update option text
  const updateOptionText = (idx, value) => {
    const updated = [...newOptions];
    updated[idx].text = value;
    setNewOptions(updated);
  };

  // Mark correct answer
  const markCorrect = (idx) => {
    setNewOptions(
      newOptions.map((opt, i) => ({
        ...opt,
        correct: i === idx,
      }))
    );
  };

  // Save new question
  const saveQuestion = () => {
    if (!newQuestion.trim()) {
      alert("Question text is required.");
      return;
    }

    if (newOptions.some((opt) => !opt.text.trim())) {
      alert("All choices must have text.");
      return;
    }

    if (!newOptions.some((opt) => opt.correct)) {
      alert("Please select the correct answer.");
      return;
    }

    axios
      .post(`${import.meta.env.VITE_API_URL}/api/questions`, {
        question: newQuestion,
        options: newOptions,
      })
      .then(() => {
        alert("Question added successfully!");
        setNewQuestion("");
        setNewOptions([{ text: "", correct: false }]);

        return axios.get(`${import.meta.env.VITE_API_URL}/api/questions`);
      })
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error("Save error:", err));
  };

  return (
    <div className="container mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg p-8">

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-center mb-12">
          🧠 Career Discovery Questionnaire
        </h1>

        {/* ADD QUESTION */}
        <div className="bg-blue-50 p-6 rounded-lg mb-10">
          <h2 className="text-xl font-bold mb-4">Add New Question</h2>

          <input
            type="text"
            placeholder="Enter question"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="w-full p-3 border rounded mb-4"
          />

          <h3 className="font-semibold mb-2">Choices:</h3>

          {newOptions.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-3 mb-2">
              <input
                type="text"
                placeholder={`Choice ${idx + 1}`}
                value={opt.text}
                onChange={(e) => updateOptionText(idx, e.target.value)}
                className="flex-1 p-2 border rounded"
              />

              <input
                type="radio"
                name="correctOption"
                checked={opt.correct}
                onChange={() => markCorrect(idx)}
              />
              <label>Correct</label>
            </div>
          ))}

          <button
            onClick={addOption}
            className="bg-gray-300 px-4 py-2 rounded mr-3"
          >
            + Add Choice
          </button>

          <button
            onClick={saveQuestion}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Question
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