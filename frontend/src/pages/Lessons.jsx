import { useEffect, useState } from "react";
import axios from "axios";
import { useSearch } from "../contexts/SearchContext";
import { useNavigate } from "react-router-dom";
import "./lessons.css"; // <-- Add your CSS file

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const { searchTerm } = useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/lessons`)
      .then((res) => {
        setLessons(res.data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        Loading lessons… Please wait 2 minutes or create a lesson.
      </div>
    );
  }

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || lesson.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="lessons-page">

      {/* ⭐ Hero Section */}
      <section className="lessons-hero">
        <div className="lessons-hero-inner">

          <div className="hero-text">
            <h1>Khám phá kho bài học STEAM</h1>
            <p>Tìm kiếm, học hỏi và sáng tạo với hàng trăm bài học chất lượng.</p>

            <button
              className="create-btn"
              onClick={() => navigate("/create-lesson")}
            >
              ➕ Tạo bài học mới
            </button>
          </div>

          <div className="hero-image">
            <img src="/lesson.png" alt="Lessons Hero" />
          </div>
        </div>
      </section>

      {/* ⭐ Filter */}
      <div className="filter-wrapper">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="category-filter"
        >
          <option value="All">Tất cả</option>
          <option value="Math">Math</option>
          <option value="Science">Natural Science</option>
          <option value="Tech">Tech</option>
          <option value="Robotics">Robotics</option>
          <option value="Science">Applied Science</option>
          <option value="Basic Knowledge">Basic Knowledge</option>
        </select>
      </div>

      {/* ⭐ Lessons Grid */}
      <div className="lessons-grid">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="lesson-card"
            onClick={() => navigate(`/lessons/${lesson.id}`)}
          >
            <img
              src={lesson.imageUrl || "/placeholder.png"}
              alt={lesson.title}
              className="lesson-image"
            />

            <div className="lesson-info">
              <h3>{lesson.title}</h3>
              <p className="lesson-desc">{lesson.description}</p>

              <p className="lesson-meta">
                {lesson.category} • {lesson.level}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Lessons;