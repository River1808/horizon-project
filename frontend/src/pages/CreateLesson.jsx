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
        className="bg-white shadow-lg p-6 rounded-lg space-y-6"
      >
        {/* Title */}
        <div className="flex flex-col space-y-1">
          <label className="font-medium">Lesson Title</label>
          <input
            name="title"
            placeholder="Enter lesson title"
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>

        {/* Summary */}
        <div className="flex flex-col space-y-1">
          <label className="font-medium">Short Summary</label>
          <input
            name="description"
            placeholder="Brief lesson summary"
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>

        {/* Full Content */}
        <div className="flex flex-col space-y-1">
          <label className="font-medium">Full Content</label>
          <textarea
            name="content"
            placeholder="Write the full lesson content here..."
            rows="6"
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />
        </div>

        {/* Category Dropdown */}
        <div className="flex flex-col space-y-1">
          <label className="font-medium">Category</label>
          <select
            name="category"
            onChange={handleChange}
            className="w-full p-3 border rounded bg-white"
            required
          >
            <option value="">Select a category</option>
            <option>Math</option>
            <option>Natural Science</option>
            <option>Tech</option>
            <option>Robotics</option>
            <option>Applied Science</option>
            <option>Basic Knowledge</option>
          </select>
        </div>

        {/* Level Dropdown */}
        <div className="flex flex-col space-y-1">
          <label className="font-medium">Difficulty Level</label>
          <select
            name="level"
            onChange={handleChange}
            className="w-full p-3 border rounded bg-white"
            required
          >
            <option value="">Select a level</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        {/* Image Upload */}
        <div className="flex flex-col space-y-1">
          <label className="font-medium">Upload Image</label>
          <input
            type="file"
            onChange={handleImage}
            className="w-full p-2 border rounded"
          />

          {image && (
            <img
              src={image}
              alt="preview"
              className="w-full h-48 object-cover rounded mt-3 shadow"
            />
          )}
        </div>

        {/* Submit Button */}
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