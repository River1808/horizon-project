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

// Merge Leaflet default icons once
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Red marker for newly added stations
const newMarkerIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MapPage = () => {
  const [stations, setStations] = useState([]);
  const [tempMarker, setTempMarker] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [newMarkerIds, setNewMarkerIds] = useState([]);
  const [mapKey, setMapKey] = useState(Date.now()); // NEW: forces MapContainer remount
  const { searchTerm } = useSearch();

  const [form, setForm] = useState({
    name: "",
    address: "",
    activity: "",
    manager: "",
    volunteersNeeded: "",
    googleFormLink: "",
  });

  const loadStations = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/stations`);
      setStations(res.data);
    } catch (err) {
      console.error("Load error:", err);
    }
  };

  // Reload stations whenever the page is visited
  useEffect(() => {
    loadStations();
    setMapKey(Date.now()); // force remount of MapContainer
  }, []);

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
      activities: form.activity ? [form.activity] : [],
      manager: form.manager,
      volunteersNeeded: Number(form.volunteersNeeded),
      googleFormLink: form.googleFormLink || null,
      lat: tempMarker.lat,
      lng: tempMarker.lng,
    };

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/stations`, payload);

      const newStation = { ...res.data, location: { lat: tempMarker.lat, lng: tempMarker.lng } };
      setStations((prev) => [...prev, newStation]);
      setNewMarkerIds((prev) => [...prev, res.data._id || res.data.id]);

      setTempMarker(null);
      setShowPanel(false);
      setForm({
        name: "",
        address: "",
        activity: "",
        manager: "",
        volunteersNeeded: "",
        googleFormLink: "",
      });

      setTimeout(() => {
        setNewMarkerIds((prev) => prev.filter((id) => id !== (res.data._id || res.data.id)));
      }, 5000);
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to create station. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this station?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/stations/${id}`);
      loadStations();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete station.");
    }
  };

  const handleVolunteer = async (id) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/stations/${id}/volunteer-request`, {
        userName: "Guest",
        message: "Interested in volunteering",
      });
      alert("Volunteer request submitted!");
    } catch (err) {
      console.error("Volunteer error:", err);
      alert("Failed to submit volunteer request.");
    }
  };

  const filteredStations = stations.filter((s) => {
    const lat = s.location?.lat;
    const lng = s.location?.lng;
    if (lat === undefined || lng === undefined) return false;

    const nameMatch = s.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const activityMatch = (s.activities || []).some((a) =>
      a.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return nameMatch || activityMatch;
  });

  return (
    <div>
      <section className="map-hero">
        <div className="map-hero-text">
          <h1>STEAM Stations Map</h1>
          <p>Click anywhere on the map to create a new station.</p>
        </div>
        <div className="map-hero-img">
          <img src="/map-hero.jpg" alt="Map Hero" />
        </div>
      </section>

      <div className="map-container">
        <div className="map-wrapper">
          <MapContainer
            key={mapKey} // force remount on page revisit
            center={[10.776, 106.7]}
            zoom={13}
            className="map"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapClick />

            {filteredStations.map((s) => {
              const lat = s.location?.lat;
              const lng = s.location?.lng;
              const id = s._id || s.id;

              if (!lat || !lng) return null;

              return (
                <Marker
                  key={id}
                  position={[lat, lng]}
                  icon={newMarkerIds.includes(id) ? newMarkerIcon : undefined}
                >
                  <Popup>
                    <h3>{s.name}</h3>
                    <p>📍 {s.address}</p>
                    <p>🎯 {(s.activities || []).join(", ")}</p>
                    <p>👤 {s.manager}</p>
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
                    <button className="volunteer-btn" onClick={() => handleVolunteer(id)}>
                      Volunteer
                    </button>
                    <button className="edit-btn" onClick={() => (window.location.href = `/edit-station/${id}`)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(id)}>
                      Delete
                    </button>
                  </Popup>
                </Marker>
              );
            })}

            {tempMarker && <Marker position={tempMarker} />}
          </MapContainer>
        </div>

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

          <label>Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <label>Address</label>
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />

          <label>Activity</label>
          <textarea value={form.activity} onChange={(e) => setForm({ ...form, activity: e.target.value })} />

          <label>Manager</label>
          <input value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} />

          <label>Volunteers Needed</label>
          <input type="number" value={form.volunteersNeeded} onChange={(e) => setForm({ ...form, volunteersNeeded: e.target.value })} />

          <label>Google Form (optional)</label>
          <input value={form.googleFormLink} onChange={(e) => setForm({ ...form, googleFormLink: e.target.value })} placeholder="https://forms.gle/123..." />

          <button className="submit-btn" onClick={handleSubmit}>
            Submit
          </button>

          <button className="cancel-btn" onClick={() => { setShowPanel(false); setTempMarker(null); }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPage;