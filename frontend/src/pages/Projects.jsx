import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearch } from '../contexts/SearchContext';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const { searchTerm } = useSearch();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/projects`).then(res => setProjects(res.data));
  }, []);

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.goal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container p-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-center mb-12 title">🚀 STEAM Projects</h1>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {filteredProjects.map(project => (
            <div key={project.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🔬</div>
              <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
              <p className="text-gray-600 mb-2">{project.goal}</p>
              <p className="text-sm text-blue-600">Expected Outcomes: {project.expectedOutcomes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;