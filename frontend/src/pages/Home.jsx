import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";   // <-- add this line

const Home = () => {
  const [lessons, setLessons] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/lessons`)
      .then((res) => {
        setLessons(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const filteredLessons = lessons.filter((lesson) => {
    const matchesCategory =
      categoryFilter === "All" || lesson.category === categoryFilter;
    return matchesCategory;
  });


  return (
    <div className="home-container">

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">

          {/* Left Text */}
          <div className="hero-text">
            <h1>Chào mừng đến với Herizon!</h1>
            <p>Khám phá STEAM, sáng tạo tương lai</p>

            {/* BLUE BUTTON */}
            <Link to="/lessons" className="hero-btn">
              Bắt đầu khám phá
            </Link>
          </div>

          {/* Right Image */}
          <div className="hero-image">
            <img src="/home.png" alt="Hero" />
          </div>

        </div>
      </section>
      {/* ⭐ LESSONS FROM DATABASE */}
      <section className="py-16 lessons-section">
        <div className="max-w-6xl mx-auto px-6">

          {/* TITLE */}
          <h2 className="section-title">Bài học STEAM mới nhất</h2>

          {/* ⬇️ MOVE FILTER HERE (below the title) */}
          <div className="mb-6 filter-wrapper">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-3 border rounded-lg shadow-sm category-filter"
            >
              <option value="All">All Categories</option>
              <option value="Math">Math</option>
              <option value="Natural Science">Natural Science</option>
              <option value="Tech">Tech</option>
              <option value="Robotics">Robotics</option>
              <option value="Applied Science">Applied Science</option>
              <option value="Basic Knowledge">Basic Knowledge</option>
            </select>
          </div>

          {/* LESSON LIST */}
          {filteredLessons.length === 0 ? (
            <p className="text-center text-gray-700">
              Hiện chưa có bài học phù hợp. Hãy thử chọn chủ đề khác hoặc tạo mới!
            </p>
          ) : (
            <div className="lessons-grid">
              {filteredLessons.slice(0, 6).map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => navigate(`/lessons/${lesson.id}`)}
                  className="lesson-card"
                >
                  <img
                    src={lesson.imageUrl || "/placeholder.png"}
                    alt={lesson.title}
                    className="lesson-img"
                  />

                  <div className="lesson-content">
                    <h3>{lesson.title}</h3>
                    <p className="desc">{lesson.description}</p>
                    <p className="meta">
                      {lesson.category} • {lesson.level}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW MORE BUTTON */}
          <div className="more-btn-container">
            <Link to="/lessons" className="more-btn">
              Xem thêm bài học →
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;