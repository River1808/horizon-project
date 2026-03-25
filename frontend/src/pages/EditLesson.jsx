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

  const [newImage, setNewImage] = useState(null);
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

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", newImage);

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return res.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = lesson.imageUrl;

    // If new image selected, upload first
    if (newImage) {
      imageUrl = await uploadImage();
    }

    await axios.put(`${import.meta.env.VITE_API_URL}/api/lessons/${id}`, {
      ...lesson,
      imageUrl
    });

    navigate(`/lessons/${id}`);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;

    await axios.delete(`${import.meta.env.VITE_API_URL}/api/lessons/${id}`);
    navigate("/lessons");
  };

  if (loading)
    return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Lesson</h1>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 shadow rounded">

        {/* IMAGE PREVIEW */}
        {lesson.imageUrl && (
          <div className="w-full">
            <p className="font-medium mb-2">Current Image:</p>
            <img
              src={lesson.imageUrl}
              alt="Lesson"
              className="w-48 h-32 object-cover rounded border"
            />
          </div>
        )}

        {/* CHANGE IMAGE */}
        <div>
          <label className="block font-medium mb-1">Change Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        <input
          name="title"
          value={lesson.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-3 border rounded"
        />

        <input
          name="category"
          value={lesson.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full p-3 border rounded"
        />

        <input
          name="level"
          value={lesson.level}
          onChange={handleChange}
          placeholder="Level"
          className="w-full p-3 border rounded"
        />

        <textarea
          name="description"
          value={lesson.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-3 border rounded h-24"
        />

        <textarea
          name="content"
          value={lesson.content}
          onChange={handleChange}
          placeholder="Content"
          className="w-full p-3 border rounded h-40"
        />

        {/* SAVE BUTTON */}
        <button className="w-full px-4 py-3 bg-blue-600 text-white rounded">
          Save Changes
        </button>

        {/* DELETE BUTTON */}
        <button
          type="button"
          onClick={handleDelete}
          className="w-full px-4 py-3 bg-red-600 text-white rounded"
        >
          Delete Lesson
        </button>
      </form>
    </div>
  );
};

export default EditLesson;