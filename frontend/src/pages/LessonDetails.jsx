import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LessonDetails.css"; // <-- Add this line

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
    <div className="max-w-4xl mx-auto p-6 lesson-details-container">

      {/* Buttons */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => navigate("/lessons")}
          className="btn-back"
        >
          ⬅ Back to Lessons
        </button>

        <button
          onClick={() => navigate(`/lessons/${id}/edit`)}
          className="btn-edit"
        >
          ✏ Edit Lesson
        </button>
      </div>

      <div className="lesson-details-card">
        <div className="lesson-details-top">

          {/* LEFT — IMAGE */}
          <div className="lesson-details-img-wrapper">
            <img
              src={lesson.imageUrl}
              alt="Lesson"
              className="lesson-details-img"
            />
          </div>

          {/* RIGHT — INFO */}
          <div className="lesson-details-info">
            <h1 className="lesson-title">{lesson.title}</h1>

            <p className="lesson-description">{lesson.description}</p>

            <div className="lesson-meta">
              <p><span>Category:</span> {lesson.category}</p>
              <p><span>Level:</span> {lesson.level}</p>
              <p><span>Date:</span> {formattedDate}</p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="lesson-content-section">
          <h2 className="lesson-content-title">Lesson Content</h2>

          <p className="lesson-content-body">
            {lesson.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LessonDetails;