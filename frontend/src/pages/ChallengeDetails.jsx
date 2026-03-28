import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ChallengeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/challenges/${id}`
      );
      setChallenge(res.data);
    };
    fetchChallenge();
  }, [id]);

  if (!challenge) {
    return (
      <div className="text-center py-20 text-lg font-semibold">
        Loading challenge...
      </div>
    );
  }

  const formattedDate = challenge.createdAt
    ? new Date(challenge.createdAt).toLocaleDateString()
    : "N/A";

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/challenges")}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ⬅ Back to Challenges
      </button>

      <button
        onClick={() => navigate(`/challenges/${id}/edit`)}
        className="mb-4 px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-500 ml-3"
      >
        ✏ Edit Challenge
      </button>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">

          {/* LEFT: IMAGE */}
          <div className="w-full md:w-1/2">
            <img
              src={challenge.imageUrl || "/placeholder.png"}
              alt="challenge"
              className="w-full h-64 object-cover rounded-lg shadow"
            />
          </div>

          {/* RIGHT: INFO */}
          <div className="w-full md:w-1/2 flex flex-col gap-3">
            <h1 className="text-3xl font-bold text-gray-900">
              {challenge.title}
            </h1>

            <p className="text-gray-600">{challenge.description}</p>

            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-semibold">Category:</span>{" "}
                {challenge.category}
              </p>
              <p>
                <span className="font-semibold">Level:</span>{" "}
                {challenge.level}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {formattedDate}
              </p>
            </div>
          </div>
        </div>

        {/* FULL CONTENT */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Challenge Content
          </h2>

          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {challenge.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetails;