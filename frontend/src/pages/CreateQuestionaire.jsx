import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateQuestionnaire = () => {
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{ text: "", correct: false }]);

  // Add option
  const addOption = () => {
    setOptions([...options, { text: "", correct: false }]);
  };

  // Update option text
  const updateOptionText = (index, value) => {
    const newOpts = [...options];
    newOpts[index].text = value;
    setOptions(newOpts);
  };

  // Mark correct answer
  const markCorrect = (index) => {
    const newOpts = options.map((opt, i) => ({
      ...opt,
      correct: i === index, // only one correct
    }));
    setOptions(newOpts);
  };

  // Submit question
  const handleSubmit = async () => {
    if (!question.trim()) return alert("Question cannot be empty");
    if (options.some((o) => !o.text.trim()))
      return alert("Option text cannot be empty");
    if (!options.some((o) => o.correct))
      return alert("Please choose a correct answer");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/questions`, {
        question,
        options,
      });

      alert("Question created!");
      navigate("/questions"); // redirect back to questions list
    } catch (err) {
      console.error(err);
      alert("Error creating question");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Question</h1>

      {/* Question Input */}
      <label className="block font-semibold mb-2">Question</label>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full p-3 border rounded mb-6"
        placeholder="Enter a new question..."
      />

      {/* Options */}
      <h2 className="text-xl font-semibold mb-3">Answer Choices</h2>

      {options.map((opt, index) => (
        <div key={index} className="flex items-center gap-3 mb-3">
          <input
            type="text"
            className="flex-1 p-2 border rounded"
            placeholder={`Choice ${index + 1}`}
            value={opt.text}
            onChange={(e) => updateOptionText(index, e.target.value)}
          />

          <input
            type="radio"
            name="correct"
            checked={opt.correct}
            onChange={() => markCorrect(index)}
          />
          <span>Correct</span>
        </div>
      ))}

      <button
        onClick={addOption}
        className="px-4 py-2 bg-gray-300 rounded mb-6 mr-4"
      >
        + Add Option
      </button>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-green-600 text-white rounded"
      >
        Save Question
      </button>
    </div>
  );
};

export default CreateQuestionnaire;