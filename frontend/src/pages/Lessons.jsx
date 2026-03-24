import { useEffect, useState } from "react";
import axios from "axios";
import { useSearch } from "../contexts/SearchContext";
import { useNavigate } from "react-router-dom";

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const { searchTerm } = useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/lessons`)
      .then((res) => setLessons(res.data));
  }, []);

  const filteredLessons = lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">📘 STEAM Lessons</h1>

        <button
          onClick={() => navigate("/create-lesson")}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
        >
          ➕ Create Lesson
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition"
            onClick={() => navigate(`/lessons/${lesson.id}`)}
          >
            <img
              src={lesson.imageUrl || "https://via.placeholder.com/300"}
              alt={lesson.title}
              className="w-full h-40 object-cover"
            />

            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{lesson.title}</h2>
              <p className="text-gray-600 mb-3">{lesson.description}</p>

              <p className="text-sm text-blue-600 font-medium">
                Category: {lesson.category} • Level: {lesson.level}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lessons;