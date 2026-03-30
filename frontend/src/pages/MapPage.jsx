import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import axios from "axios";
import { useSearch } from "../contexts/SearchContext";
import "leaflet/dist/leaflet.css";
import "./MapPage.css";
import * as L from "leaflet";

const redMarkerIcon = new L.Icon({
  iconUrl: "/red-marker.png",
  iconRetinaUrl: "/red-marker.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const fixDefaultLeafletIcons = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
};

const MapClick = ({ mapReady, loading, error, onClick }) => {
  useMapEvents({
    click(e) {
      if (!mapReady || loading || error) return;
      onClick(e.latlng);
    },
  });
  return null;
};

const MapPage = () => {
  const [stations, setStations] = useState([]);
  const [tempMarker, setTempMarker] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapReady, setMapReady] = useState(false);
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
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/stations`);
      setStations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load stations", err);
      setError("Unable to load stations. Please refresh.");
      setStations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fixDefaultLeafletIcons();
    loadStations();
    const timer = setTimeout(() => setMapReady(true), 100);
    return () => {
      clearTimeout(timer);
      setTempMarker(null);
    };
  }, []);

  const handleMapClick = (latlng) => {
    setTempMarker(latlng);
    setShowPanel(true);
  };

  const handleSubmit = async () => {
    if (!tempMarker) return;

    const payload = {
      name: form.name,
      address: form.address,
      activities: form.activity ? [form.activity] : [],
      manager: form.manager,
      volunteersNeeded: Number(form.volunteersNeeded) || 0,
      googleFormLink: form.googleFormLink || null,
      location: { lat: tempMarker.lat, lng: tempMarker.lng },
    };

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/stations`, payload);
      const newStation = res.data;
      setStations((prev) => [...prev, newStation]);
      setTempMarker(null);
      setShowPanel(false);
      setForm({ name: "", address: "", activity: "", manager: "", volunteersNeeded: "", googleFormLink: "" });
    } catch (err) {
      console.error("Create station failed", err);
      alert("Station creation failed. Please try again.");
      loadStations();
    }
  };

  const filteredStations = stations.filter((s) => {
    const lat = s.location?.lat;
    const lng = s.location?.lng;
    if (lat === undefined || lng === undefined) return false;

    if (!searchTerm) return true;
    const query = searchTerm.toLowerCase();
    return (s.name || "").toLowerCase().includes(query) || (s.activities || []).some((a) => a.toLowerCase().includes(query));
  });

  return (
    <div>
      <section className="map-hero">
        <div className="map-hero-text">
          <h1>STEAM Stations Map</h1>
          <p>Click map to add one.</p>
        </div>
      </section>

      <div className="map-wrapper">
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading-message">Loading stations...</div>}

        <MapContainer center={[10.776, 106.7]} zoom={13} className="map">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapClick mapReady={mapReady} loading={loading} error={error} onClick={handleMapClick} />

          {filteredStations.map((station) => {
            const lat = station.location?.lat;
            const lng = station.location?.lng;
            if (lat === undefined || lng === undefined) return null;
            return (
              <Marker key={station._id || station.id || `${lat}-${lng}`} position={[lat, lng]} icon={redMarkerIcon}>
                <Popup>
                  <strong>{station.name || "Untitled"}</strong>
                  <div>{station.address || "No address"}</div>
                </Popup>
              </Marker>
            );
          })}

          {tempMarker && <Marker position={[tempMarker.lat, tempMarker.lng]} icon={redMarkerIcon} />}
        </MapContainer>
      </div>

      {showPanel && (
        <div className="side-panel open">
          <h2>Create Station</h2>
          <label>Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <label>Address</label>
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <label>Activity</label>
          <input value={form.activity} onChange={(e) => setForm({ ...form, activity: e.target.value })} />
          <label>Manager</label>
          <input value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} />
          <label>Volunteers Needed</label>
          <input type="number" value={form.volunteersNeeded} onChange={(e) => setForm({ ...form, volunteersNeeded: e.target.value })} />
          <label>Google Form (optional)</label>
          <input value={form.googleFormLink} onChange={(e) => setForm({ ...form, googleFormLink: e.target.value })} />
          <div className="panel-buttons">
            <button className="submit-btn" onClick={handleSubmit}>Save</button>
            <button className="cancel-btn" onClick={() => { setShowPanel(false); setTempMarker(null); }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;
