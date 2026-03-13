import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearch } from '../contexts/SearchContext';

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const { searchTerm } = useSearch();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/lessons`).then(res => setLessons(res.data));
  }, []);

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container p-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-center mb-12 title">📘 STEAM Lessons</h1>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {filteredLessons.map(lesson => (
            <div key={lesson.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📖</div>
              <h2 className="text-xl font-semibold mb-2">{lesson.title}</h2>
              <p className="text-gray-600 mb-2">{lesson.description}</p>
              <p className="text-sm text-blue-600">Category: {lesson.category} | Level: {lesson.level}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lessons;