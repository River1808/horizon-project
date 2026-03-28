import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MapPage.css";

const EditMapPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    activities: "",
    manager: "",
    volunteersNeeded: "",
  });

  // Load station details
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/stations/${id}`)
      .then((res) => {
        const st = res.data;
        setForm({
          name: st.name,
          address: st.address,
          activities: st.activities.join(", "),
          manager: st.manager,
          volunteersNeeded: st.volunteersNeeded,
        });
      });
  }, [id]);

  const handleSubmit = async () => {
    const payload = {
      name: form.name,
      address: form.address,
      activities: form.activities.split(",").map((a) => a.trim()),
      manager: form.manager,
      volunteersNeeded: Number(form.volunteersNeeded),
    };

    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/stations/${id}`,
      payload
    );

    navigate("/map"); // go back after save
  };

  return (
    <div className="edit-page">
      <h1>Edit Station</h1>

      <div className="edit-form">

        <label>Station Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label>Address</label>
        <input
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <label>Activities (comma separated)</label>
        <textarea
          value={form.activities}
          onChange={(e) => setForm({ ...form, activities: e.target.value })}
        />

        <label>Manager</label>
        <input
          value={form.manager}
          onChange={(e) => setForm({ ...form, manager: e.target.value })}
        />

        <label>Volunteers Needed</label>
        <input
          type="number"
          value={form.volunteersNeeded}
          onChange={(e) =>
            setForm({ ...form, volunteersNeeded: e.target.value })
          }
        />

        <button className="submit-btn" onClick={handleSubmit}>
          Save Changes
        </button>

        <button className="cancel-btn" onClick={() => navigate("/map")}>
          Cancel
        </button>

      </div>
    </div>
  );
};

export default EditMapPage;