import { useEffect, useState } from "react";
import axios from "axios";
import { useSearch } from "../contexts/SearchContext";
import { useNavigate } from "react-router-dom";
import "./Challenges.css";

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const { searchTerm } = useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/challenges`)
      .then((res) => {
        setChallenges(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch =
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || challenge.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="challenges-page">

      {/* ⭐ Hero Section */}
      <section className="challenges-hero">
        <div className="challenges-hero-inner">

          <div className="hero-text">
            <h1>Khám phá các thử thách STEAM</h1>
            <p>Tham gia, học hỏi và vượt qua những thử thách sáng tạo.</p>

            <button
              className="create-btn"
              onClick={() => navigate("/create-challenge")}
            >
              ➕ Tạo thử thách mới
            </button>
          </div>

          <div className="hero-image">
            <img src="/challenge.webp" alt="Challenges Hero" />
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
          <option value="Natural Science">Natural Science</option>
          <option value="Tech">Tech</option>
          <option value="Robotics">Robotics</option>
          <option value="Applied Science">Applied Science</option>
          <option value="Basic Knowledge">Basic Knowledge</option>
        </select>
      </div>

      {/* ⭐ Loading */}
      {loading && (
        <div className="loading-screen">
          Loading challenges… Please wait.
        </div>
      )}

      {/* ⭐ Empty State if DB has no challenges */}
      {!loading && challenges.length === 0 && (
        <div className="empty-message">
          <p>Hiện chưa có thử thách nào.</p>
          <button className="create-btn" onClick={() => navigate("/create-challenge")}>
            ➕ Tạo thử thách đầu tiên
          </button>
        </div>
      )}

      {/* ⭐ Grid */}
      {!loading && challenges.length > 0 && (
        <div className="challenges-grid">
          {filteredChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="challenge-card"
              onClick={() => navigate(`/challenges/${challenge.id}`)}
            >
              <img
                src={challenge.imageUrl || "/placeholder.png"}
                alt={challenge.title}
                className="challenge-image"
              />

              <div className="challenge-info">
                <h3>{challenge.title}</h3>
                <p className="challenge-desc">{challenge.description}</p>

                <p className="challenge-meta">
                  {challenge.category} • {challenge.level}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Challenges;