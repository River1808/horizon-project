import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const QuestionsList = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/questions`)
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error(err));
  }, []);

  const deleteQuestion = async (id) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/questions/${id}`);
      setQuestions((prev) => prev.filter((q) => (q.id || q._id) !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting question");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Questions</h1>

        <button
          onClick={() => navigate("/create-question")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + New Question
        </button>
      </div>

      <div className="space-y-4">
        {questions.map((q, index) => {
          const questionId = q.id || q._id || index;

          return (
            <div
              key={questionId}
              className="bg-white shadow p-4 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{q.question}</p>
                <p className="text-sm text-gray-500">Section: {q.section}</p>
                <ul className="ml-4 text-gray-600 text-sm">
                  {q.options.map((opt, i) => (
                    <li key={i}>
                      {opt.text} - {opt.category} (+{opt.points})
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/edit-question/${questionId}`)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteQuestion(questionId)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionsList;
