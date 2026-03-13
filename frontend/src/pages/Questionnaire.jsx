import { useEffect, useState } from 'react';
import axios from 'axios';

const Questionnaire = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/questionnaire`).then(res => setQuestions(res.data));
  }, []);

  const handleSubmit = () => {
    axios.post(`${import.meta.env.VITE_API_URL}/api/questionnaire/submit`, {userName: 'Guest', answers}).then(res => setResult(res.data.personality));
  };

  return (
    <div className="container mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-12">🧠 Career Discovery Questionnaire</h1>
        {!result ? (
          <div className="max-w-2xl mx-auto">
            {questions.map(q => (
              <div key={q.id} className="mb-6 bg-gray-50 p-6 rounded-lg shadow-md">
                <p className="text-lg font-semibold mb-4">{q.question}</p>
                {q.options.map(opt => (
                  <label key={opt} className="block mb-2">
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                      className="mr-2"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ))}
            <div className="text-center">
              <button onClick={handleSubmit} className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition">
                Discover My Personality
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Your Personality Type: {result}</h2>
            <p className="text-lg">Based on your answers, you might enjoy careers in STEAM fields that match your interests!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;