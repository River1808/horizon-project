import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const QuestionBuilder = () => {
  const { id } = useParams(); // undefined if creating new
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{ text: "", correct: false }]);

  // Load existing question if editing
  useEffect(() => {
    if (!id) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/questions/${id}`)
      .then((res) => {
        setQuestion(res.data.question);
        setOptions(res.data.options);
      })
      .catch(() => alert("Error loading question"));
  }, [id]);

  const addOption = () => {
    setOptions([...options, { text: "", correct: false }]);
  };

  const updateOption = (index, value) => {
    const updated = [...options];
    updated[index].text = value;
    setOptions(updated);
  };

  const setCorrectOption = (index) => {
    setOptions(
      options.map((opt, i) => ({
        ...opt,
        correct: i === index,
      }))
    );
  };

  const removeOption = (index) => {
    if (options.length <= 1) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!question.trim()) return alert("Question cannot be empty");
    if (options.some((o) => !o.text.trim()))
      return alert("Options cannot be empty");
    if (!options.some((o) => o.correct))
      return alert("Select the correct answer");

    const payload = { question, options };

    try {
      if (id) {
        // UPDATE EXISTING
        await axios.put(`${import.meta.env.VITE_API_URL}/api/questions/${id}`, payload);
        alert("Question updated!");
      } else {
        // CREATE NEW
        await axios.post(`${import.meta.env.VITE_API_URL}/api/questions`, payload);
        alert("Question created!");
      }

      navigate("/questions");
    } catch (err) {
      console.error(err);
      alert("Error saving question");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 shadow rounded">
      <h1 className="text-3xl font-bold mb-6">
        {id ? "Edit Question" : "Create Question"}
      </h1>

      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full border p-3 rounded mb-6"
        placeholder="Enter question"
      />

      <div className="space-y-4">
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-3">
            <input
              type="radio"
              checked={opt.correct}
              onChange={() => setCorrectOption(i)}
            />
            <input
              type="text"
              value={opt.text}
              className="flex-1 border p-2 rounded"
              onChange={(e) => updateOption(i, e.target.value)}
            />
            <button
              onClick={() => removeOption(i)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              -
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addOption}
        className="mt-4 bg-gray-300 px-4 py-2 rounded"
      >
        + Add Option
      </button>

      <button
        onClick={handleSubmit}
        className="block mt-8 bg-purple-600 text-white px-8 py-3 rounded mx-auto"
      >
        {id ? "Update Question" : "Save Question"}
      </button>
    </div>
  );
};

export default QuestionBuilder;