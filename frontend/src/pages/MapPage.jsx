import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import axios from "axios";
import { useSearch } from "../contexts/SearchContext";
import "leaflet/dist/leaflet.css";
import "./MapPage.css";

import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapPage = () => {
  const [stations, setStations] = useState([]);
  const [tempMarker, setTempMarker] = useState(null);
  const [showPanel, setShowPanel] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
    activity: "",
    manager: "",
    volunteersNeeded: "",
    googleFormLink: "", // ⭐ NEW FIELD
  });

  const { searchTerm } = useSearch();

  const loadStations = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/stations`)
      .then((res) => setStations(res.data));
  };

  useEffect(loadStations, []);

  const MapClick = () => {
    useMapEvents({
      click(e) {
        setTempMarker(e.latlng);
        setShowPanel(true);
      },
    });
    return null;
  };

  const handleSubmit = async () => {
    if (!tempMarker) return;

    const payload = {
      name: form.name,
      address: form.address,
      activities: [form.activity],
      manager: form.manager,
      volunteersNeeded: Number(form.volunteersNeeded),
      googleFormLink: form.googleFormLink || null, // ⭐ OPTIONAL
      location: {
        lat: tempMarker.lat,
        lng: tempMarker.lng,
      },
    };

    await axios.post(`${import.meta.env.VITE_API_URL}/api/stations`, payload);

    setForm({
      name: "",
      address: "",
      activity: "",
      manager: "",
      volunteersNeeded: "",
      googleFormLink: "",
    });

    setTempMarker(null);
    setShowPanel(false);
    loadStations();
  };

  const handleVolunteer = (stationId) => {
    axios.post(
      `${import.meta.env.VITE_API_URL}/api/stations/${stationId}/volunteer-request`,
      {
        userName: "Guest",
        message: "Interested in volunteering",
      }
    );
    alert("Volunteer request submitted!");
  };

  const handleDelete = async (stationId) => {
    if (!confirm("Delete this station?")) return;

    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/stations/${stationId}`
    );

    loadStations();
  };

  const filteredStations = stations.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.activities.some((a) =>
        a.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div>
      {/* HERO SECTION */}
      <section className="map-hero">
        <div className="map-hero-text">
          <h1>STEAM Stations Map</h1>
          <p>
            Click anywhere on the map to create a new station, add activities,
            and support volunteers in your community.
          </p>
        </div>

        <div className="map-hero-img">
          <img src="/map-hero.jpg" alt="Map Hero" />
        </div>
      </section>

      {/* MAP + PANEL */}
      <div className="map-container">
        <div className="map-wrapper">
          <MapContainer center={[10.776, 106.7]} zoom={13} className="map">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapClick />

            {filteredStations.map((s) => (
              <Marker key={s.id} position={[s.location.lat, s.location.lng]}>
                <Popup>
                  <h3>{s.name}</h3>
                  <p>📍 {s.address}</p>
                  <p>🎯 {s.activities.join(", ")}</p>
                  <p>👤 Manager: {s.manager}</p>

                  {s.googleFormLink && (
                    <p>
                      📝{" "}
                      <a
                        href={s.googleFormLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Registration Form
                      </a>
                    </p>
                  )}

                  <button
                    className="volunteer-btn"
                    onClick={() => handleVolunteer(s.id)}
                  >
                    Volunteer
                  </button>

                  <button
                    className="edit-btn"
                    onClick={() =>
                      (window.location.href = `/edit-station/${s.id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(s.id)}
                  >
                    Delete
                  </button>
                </Popup>
              </Marker>
            ))}

            {tempMarker && <Marker position={tempMarker} />}
          </MapContainer>
        </div>

        {/* CREATE PANEL */}
        <div className={`side-panel ${showPanel ? "open" : ""}`}>
          <button
            className="close-btn"
            onClick={() => {
              setShowPanel(false);
              setTempMarker(null);
            }}
          >
            ✕
          </button>

          <h2>Create Station</h2>

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

          <label>Activity</label>
          <textarea
            value={form.activity}
            onChange={(e) => setForm({ ...form, activity: e.target.value })}
          />

          <label>Manager Name</label>
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

          {/* ⭐ NEW FIELD */}
          <label>Google Form Link (Optional)</label>
          <input
            placeholder="https://forms.gle/..."
            value={form.googleFormLink}
            onChange={(e) =>
              setForm({ ...form, googleFormLink: e.target.value })
            }
          />

          <button className="submit-btn" onClick={handleSubmit}>
            Submit
          </button>

          <button
            className="cancel-btn"
            onClick={() => {
              setShowPanel(false);
              setTempMarker(null);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPage;