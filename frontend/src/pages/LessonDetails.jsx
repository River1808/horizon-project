import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const LessonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/lessons/${id}`
      );
      setLesson(res.data);
    };
    fetchLesson();
  }, [id]);

  if (!lesson) {
    return (
      <div className="text-center py-20 text-lg font-semibold">
        Loading lesson...
      </div>
    );
  }

  const formattedDate = lesson.createdAt
    ? new Date(lesson.createdAt).toLocaleDateString()
    : "N/A";

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/lessons")}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ⬅ Back to Lessons
      </button>
      <button
        onClick={() => navigate(`/lessons/${id}/edit`)}
        className="mb-4 px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-500 ml-3"
      >
        ✏ Edit Lesson
      </button>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          {/* LEFT: IMAGE */}
          <div className="w-full md:w-1/2">
            <img
              src={lesson.imageUrl}
              alt="lesson"
              className="w-full h-64 object-cover rounded-lg shadow"
            />
          </div>

          {/* RIGHT: TITLE + INFO */}
          <div className="w-full md:w-1/2 flex flex-col gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>

            <p className="text-gray-600">{lesson.description}</p>

            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-semibold">Category:</span> {lesson.category}
              </p>
              <p>
                <span className="font-semibold">Level:</span> {lesson.level}
              </p>
              <p>
                <span className="font-semibold">Date:</span> {formattedDate}
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT BELOW */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Lesson Content
          </h2>

          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {lesson.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LessonDetails;