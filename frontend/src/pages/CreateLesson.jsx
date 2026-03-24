import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateLesson = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    level: "",
  });

  const [image, setImage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newLesson = {
      ...form,
      imageUrl: image,
    };

    await axios.post(`${import.meta.env.VITE_API_URL}/api/lessons`, newLesson);

    navigate("/lessons");
  };

  return (
    <div className="container mx-auto max-w-xl p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        ➕ Create New Lesson
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-6 rounded-lg space-y-4"
      >
        <input
          name="title"
          placeholder="Lesson Title"
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <input
          name="description"
          placeholder="Short Summary"
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <textarea
          name="content"
          placeholder="Full Content"
          rows="5"
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <input
          name="category"
          placeholder="Category (Science, Math...)"
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          name="level"
          placeholder="Level (Beginner / Intermediate / Advanced)"
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <label className="block font-medium">Upload Image</label>
        <input type="file" onChange={handleImage} className="w-full p-2" />

        {image && (
          <img
            src={image}
            className="w-full h-40 object-cover rounded mt-3 shadow"
          />
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 shadow"
        >
          ✔ Create Lesson
        </button>
      </form>
    </div>
  );
};

export default CreateLesson;