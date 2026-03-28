import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const categories = [
  "Math",
  "Natural Science",
  "Tech",
  "Robotics",
  "Applied Science",
  "Basic Knowledge"
];

const levels = ["Beginner", "Intermediate", "Advanced"];

const EditChallenge = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState({
    title: "",
    category: "",
    level: "",
    description: "",
    content: "",
    imageUrl: ""
  });

  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch existing challenge
  useEffect(() => {
    const fetchChallenge = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/challenges/${id}`
      );
      setChallenge(res.data);
      setLoading(false);
    };
    fetchChallenge();
  }, [id]);

  // Form field update
  const handleChange = (e) => {
    setChallenge({ ...challenge, [e.target.name]: e.target.value });
  };

  // New image selected
  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  // Upload file to Cloudinary
  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", newImage);

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/challenges/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return res.data.url;
  };

  // Save challenge
  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = challenge.imageUrl;

    if (newImage) {
      imageUrl = await uploadImage();
    }

    await axios.put(`${import.meta.env.VITE_API_URL}/api/challenges/${id}`, {
      ...challenge,
      imageUrl
    });

    navigate(`/challenges/${id}`);
  };

  // Delete challenge
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this challenge?")) return;

    await axios.delete(`${import.meta.env.VITE_API_URL}/api/challenges/${id}`);
    navigate("/challenges");
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Challenge</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow rounded">

        {/* Image Preview */}
        {challenge.imageUrl && (
          <div>
            <p className="font-medium mb-2">Current Image:</p>
            <img
              src={challenge.imageUrl}
              className="w-48 h-32 object-cover rounded border"
            />
          </div>
        )}

        {/* Replace Image */}
        <div>
          <label className="block font-medium mb-1">Change Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {/* Title */}
        <input
          name="title"
          value={challenge.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-3 border rounded"
        />

        {/* Category Dropdown */}
        <select
          name="category"
          value={challenge.category}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Level Dropdown */}
        <select
          name="level"
          value={challenge.level}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        >
          <option value="">Select Level</option>
          {levels.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        {/* Description */}
        <textarea
          name="description"
          value={challenge.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-3 border rounded h-24"
        />

        {/* Content */}
        <textarea
          name="content"
          rows="6"
          value={challenge.content}
          onChange={handleChange}
          placeholder="Full Challenge Content"
          className="w-full p-3 border rounded"
        />

        {/* SAVE BUTTON */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded font-medium"
        >
          Save Changes
        </button>

        {/* DELETE BUTTON */}
        <button
          type="button"
          onClick={handleDelete}
          className="w-full py-3 bg-red-600 text-white rounded mt-2"
        >
          Delete Challenge
        </button>
      </form>
    </div>
  );
};

export default EditChallenge;