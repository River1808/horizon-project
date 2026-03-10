import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useSearch } from '../contexts/SearchContext';
import './Header.css';

const Header = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:8082/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();
        setUser({ role: data.role, token: data.token });
        setShowLogin(false);
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-container">

          <Link to="/" className="logo">🌱 Herizon</Link>

          <nav className="nav">
            <Link to="/lessons">Lessons</Link>
            <Link to="/challenges">Challenges</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/map">Map</Link>
            <Link to="/questionnaire">Questionnaire</Link>
          </nav>

          <div className="header-actions">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button onClick={() => setShowLogin(true)}>
              Login as Admin
            </button>

          </div>

        </div>
      </header>

      {showLogin && (
        <div className="login-overlay">
          <div className="login-box">
            <h2>Admin Login</h2>

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="login-buttons">
              <button onClick={handleLogin}>Login</button>
              <button onClick={() => setShowLogin(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;