import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearch } from '../contexts/SearchContext';

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const { searchTerm } = useSearch();

  useEffect(() => {
    axios.get('${import.meta.env.VITE_API_URL}/api/challenges').then(res => setChallenges(res.data));
  }, []);

  const filteredChallenges = challenges.filter(challenge =>
    challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container p-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-center mb-12 title">🎯 STEAM Challenges</h1>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {filteredChallenges.map(challenge => (
            <div key={challenge.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🧪</div>
              <h2 className="text-xl font-semibold mb-2">{challenge.title}</h2>
              <p className="text-gray-600 mb-2">{challenge.description}</p>
              <p className="text-sm text-blue-600">Difficulty: {challenge.difficulty} | Time: {challenge.estimatedTime}</p>
              <p className="text-sm text-gray-500">Materials: {challenge.materials.join(', ')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Challenges;