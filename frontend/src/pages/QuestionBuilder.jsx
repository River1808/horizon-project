import { useState } from "react";
import axios from "axios";

const QuestionBuilder = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{ text: "", correct: false }]);

  const addOption = () => {
    setOptions([...options, { text: "", correct: false }]);
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const setCorrectOption = (index) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      correct: i === index
    }));
    setOptions(newOptions);
  };

  const removeOption = (index) => {
    if (options.length === 1) return; // must have ≥ 1 option
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!question.trim()) return alert("Question cannot be empty!");
    if (options.some((opt) => !opt.text.trim())) return alert("All options must have text.");
    if (!options.some((opt) => opt.correct)) return alert("Select a correct answer.");

    const payload = {
      question,
      options
    };

    await axios.post(`${import.meta.env.VITE_API_URL}/api/questions`, payload);

    alert("Question saved!");

    // Reset form
    setQuestion("");
    setOptions([{ text: "", correct: false }]);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg p-8 rounded-xl">
      <h1 className="text-3xl font-bold mb-6">Create a Question</h1>

      {/* Question Input */}
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter question..."
        className="w-full border p-3 rounded mb-6"
      />

      {/* Options */}
      <div className="space-y-4">
        {options.map((opt, index) => (
          <div key={index} className="flex items-center gap-3">
            <input
              type="radio"
              checked={opt.correct}
              onChange={() => setCorrectOption(index)}
            />

            <input
              type="text"
              value={opt.text}
              placeholder={`Option ${index + 1}`}
              onChange={(e) => updateOption(index, e.target.value)}
              className="flex-1 border p-2 rounded"
            />

            {/* Remove option */}
            <button
              onClick={() => removeOption(index)}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              -
            </button>
          </div>
        ))}
      </div>

      {/* Add Option */}
      <button
        onClick={addOption}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        + Add Option
      </button>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="block mt-8 bg-purple-600 text-white px-8 py-3 rounded-full mx-auto"
      >
        Save Question
      </button>
    </div>
  );
};

export default QuestionBuilder;