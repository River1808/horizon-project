import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";   // <-- add this line

const Home = () => {
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/lessons`)
      .then((res) => setLessons(res.data))
      .catch((err) => console.error(err));
  }, []);

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
      <section className="lessons-section">
        <div className="lessons-container">

          <h2 className="lessons-title">Bài học STEAM mới nhất</h2>

          {lessons.length === 0 ? (
            <p className="lessons-empty">Hiện chưa có bài học. Hãy tạo bài học mới!</p>
          ) : (
            <div className="lessons-grid">
              {lessons.slice(0, 6).map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => navigate(`/lessons/${lesson.id}`)}
                  className="lesson-card"
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
          )}

          <div className="lessons-more">
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