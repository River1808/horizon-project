import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditLesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState({
    title: "",
    category: "",
    level: "",
    description: "",
    content: "",
    imageUrl: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/lessons/${id}`
      );
      setLesson(res.data);
      setLoading(false);
    };
    fetchLesson();
  }, [id]);

  const handleChange = (e) => {
    setLesson({ ...lesson, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/lessons/${id}`,
      lesson
    );
    navigate(`/lessons/${id}`);
  };

  if (loading)
    return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Lesson</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={lesson.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          name="category"
          value={lesson.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          name="level"
          value={lesson.level}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <textarea
          name="description"
          value={lesson.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <textarea
          name="content"
          value={lesson.content}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditLesson;