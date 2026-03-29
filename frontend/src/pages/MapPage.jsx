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

// Merge Leaflet default icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const newMarkerIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MapPage = () => {
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [tempMarker, setTempMarker] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [newMarkerIds, setNewMarkerIds] = useState([]);
  const { searchTerm } = useSearch();

  const [form, setForm] = useState({
    name: "", address: "", activity: "", manager: "", volunteersNeeded: "", googleFormLink: "",
  });

  const loadStations = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/stations`);
      setStations(res.data);
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStations();
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
      location: {
        lat: tempMarker.lat,
        lng: tempMarker.lng,
      },
    };

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/stations`, payload);
      // Ensure the structure matches your MongoDB 'location' object exactly
      const newStation = { ...res.data, location: { lat: tempMarker.lat, lng: tempMarker.lng } };
      
      setStations((prev) => [...prev, newStation]);
      setNewMarkerIds((prev) => [...prev, res.data._id || res.data.id]);
      setTempMarker(null);
      setShowPanel(false);
      setForm({ name: "", address: "", activity: "", manager: "", volunteersNeeded: "", googleFormLink: "" });

      setTimeout(() => {
        setNewMarkerIds((prev) => prev.filter((id) => id !== (res.data._id || res.data.id)));
      }, 5000);
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this station?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/stations/${id}`);
      setStations((prev) => prev.filter(s => (s._id || s.id) !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredStations = stations.filter((s) => {
    const lat = s.location?.lat;
    const lng = s.location?.lng;
    if (lat === undefined || lng === undefined) return false;

    const term = searchTerm.toLowerCase();
    return (
      s.name?.toLowerCase().includes(term) ||
      (s.activities || []).some((a) => a.toLowerCase().includes(term))
    );
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
          {/* THE FIX: Only render MapContainer when not loading */}
          {!isLoading ? (
            <MapContainer
              center={[10.776, 106.7]}
              zoom={13}
              className="map"
              scrollWheelZoom={true}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapClick />

              {filteredStations.map((s) => {
                const lat = s.location?.lat;
                const lng = s.location?.lng;
                const id = s._id || s.id;

                return (
                  <Marker
                    key={id}
                    position={[lat, lng]}
                    icon={newMarkerIds.includes(id) ? newMarkerIcon : undefined}
                  >
                    <Popup>
                      <h3>{s.name}</h3>
                      <p>📍 {s.address}</p>
                      <button className="delete-btn" onClick={() => handleDelete(id)}>Delete</button>
                    </Popup>
                  </Marker>
                );
              })}

              {tempMarker && <Marker position={tempMarker} />}
            </MapContainer>
          ) : (
            <div className="map-loading">
              <p>Loading markers from database...</p>
            </div>
          )}
        </div>

        <div className={`side-panel ${showPanel ? "open" : ""}`}>
          <button className="close-btn" onClick={() => { setShowPanel(false); setTempMarker(null); }}>✕</button>
          <h2>Create Station</h2>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default MapPage;