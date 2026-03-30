import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapPage.css";

// Fix default Leaflet icons - moved inside component to avoid build issues
const fixLeafletIcons = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
};

// Red marker icon for editing
const editMarkerIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const EditMapPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    activities: "",
    manager: "",
    volunteersNeeded: "",
    googleFormLink: "",
  });

  const [markerPosition, setMarkerPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Load station details and initialize icons
  useEffect(() => {
    fixLeafletIcons();
    setLoading(true);
    setFetchError(null);

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/stations/${id}`)
      .then((res) => {
        const st = res.data;
        setForm({
          name: st.name || "",
          address: st.address || "",
          activities: (st.activities || []).join(", "),
          manager: st.manager || "",
          volunteersNeeded: st.volunteersNeeded || "",
          googleFormLink: st.googleFormLink || "",
        });

        if (st.location) {
          setMarkerPosition({ lat: st.location.lat, lng: st.location.lng });
        }
      })
      .catch((err) => {
        console.error("Load edit station failed", err);
        if (err.response?.status === 404) {
          setFetchError("Station not found (404). Please check the URL or create a station first.");
        } else {
          setFetchError("Failed to load station data. Please try again.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async () => {
    if (!markerPosition) {
      alert("Please select a location on the map!");
      return;
    }

    const payload = {
      name: form.name,
      address: form.address,
      activities: form.activities.split(",").map((a) => a.trim()),
      manager: form.manager,
      volunteersNeeded: Number(form.volunteersNeeded),
      googleFormLink: form.googleFormLink || null,
      location: {
        lat: markerPosition.lat,
        lng: markerPosition.lng,
      },
    };

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/stations/${id}`, payload);
      navigate("/map");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update station.");
    }
  };

  const MapClick = () => {
    useMapEvents({
      click(e) {
        setMarkerPosition(e.latlng);
      },
    });
    return null;
  };

  if (loading) {
    return (
      <div className="edit-page">
        <h1>Edit Station</h1>
        <p>Loading station data...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="edit-page">
        <h1>Edit Station</h1>
        <div className="error-message">{fetchError}</div>
        <button className="cancel-btn" onClick={() => navigate("/map")}>Back to map</button>
      </div>
    );
  }

  return (
    <div className="edit-page">
      <h1>Edit Station</h1>

      <div className="map-wrapper" style={{ height: "400px", marginBottom: "20px" }}>
        <MapContainer
          center={markerPosition || [10.776, 106.7]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapClick />
          {markerPosition && (
            <Marker
              position={markerPosition}
              icon={editMarkerIcon}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  setMarkerPosition(e.target.getLatLng());
                },
              }}
            />
          )}
        </MapContainer>
      </div>

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

        <label>Google Form (optional)</label>
        <input
          value={form.googleFormLink}
          onChange={(e) =>
            setForm({ ...form, googleFormLink: e.target.value })
          }
          placeholder="https://forms.gle/123..."
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