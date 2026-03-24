import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SearchProvider } from './contexts/SearchContext';
import Header from './components/Header';
import Home from './pages/Home';
import Lessons from './pages/Lessons';
import Challenges from './pages/Challenges';
import Projects from './pages/Projects';
import MapPage from './pages/MapPage';
import Questionnaire from './pages/Questionnaire';
import Forum from './pages/Forum';
import CreateLesson from "./pages/CreateLesson";
function App() {
  return (
    <SearchProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
          <Header />
          <main className="pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lessons" element={<Lessons />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/questionnaire" element={<Questionnaire />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/lessons" element={<Lessons />} />
              <Route path="/create-lesson" element={<CreateLesson />} />
            </Routes>
          </main>
          <footer className="footer">
            <div className="footer-container">
              <p>&copy; 2026 Herizon. Empowering STEAM Education for All.</p>
            </div>
          </footer>
        </div>
      </Router>
    </SearchProvider>
  );
}

export default App;
