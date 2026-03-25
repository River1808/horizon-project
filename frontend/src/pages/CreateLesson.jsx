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

  const handleImage = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setImage(res.data.url); // real Cloudinary URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newLesson = {
      ...form,
      imageUrl: image,
    };

    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/lessons`,
      newLesson
    );

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
        <div>
          <label className="font-semibold">Title</label>
          <input
            name="title"
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>

        <div>
          <label className="font-semibold">Short Description</label>
          <input
            name="description"
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>

        <div>
          <label className="font-semibold">Full Content</label>
          <textarea
            name="content"
            rows="5"
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>

        <div>
          <label className="font-semibold">Category</label>
          <select
            name="category"
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          >
            <option value="">Select Category</option>
            <option>Math</option>
            <option>Natural Science</option>
            <option>Tech</option>
            <option>Robotics</option>
            <option>Applied Science</option>
            <option>Basic Knowledge</option>
          </select>
        </div>

        <div>
          <label className="font-semibold">Level</label>
          <select
            name="level"
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          >
            <option value="">Select Level</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        <div>
          <label className="font-semibold">Upload Image</label>
          <input type="file" onChange={handleImage} className="w-full p-2" />
        </div>

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