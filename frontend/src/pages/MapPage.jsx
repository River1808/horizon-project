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

// Default Leaflet icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Red marker for new stations
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

const MapClick = ({ setTempMarker, setShowPanel }) => {
  useMapEvents({
    click(e) {
      setTempMarker(e.latlng);
      setShowPanel(true);
    },
  });
  return null;
};

const MapPage = () => {
  const [stations, setStations] = useState([]);
  const [tempMarker, setTempMarker] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [newMarkerIds, setNewMarkerIds] = useState([]);
  const { searchTerm } = useSearch();

  const [form, setForm] = useState({
    name: "",
    address: "",
    activity: "",
    manager: "",
    volunteersNeeded: "",
    googleFormLink: "",
  });

  // ✅ Load stations every time the page mounts
  const loadStations = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/stations`);
      setStations(res.data);
    } catch (err) {
      console.error("Load error:", err);
    }
  };

  useEffect(() => {
    loadStations();
  }, []); // runs every mount

  // Filter stations based on search
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
      setForm({ name: "", address: "", activity: "", manager: "", volunteersNeeded: "", googleFormLink: "" });

      setTimeout(() => {
        setNewMarkerIds((prev) => prev.filter((id) => id !== (res.data._id || res.data.id)));
      }, 5000);
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to create station.");
    }
  };

  return (
    <div>
      <div className="map-container">
        <MapContainer center={[10.776, 106.7]} zoom={13} className="map">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapClick setTempMarker={setTempMarker} setShowPanel={setShowPanel} />

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
                  <p>{s.address}</p>
                  <p>{(s.activities || []).join(", ")}</p>
                </Popup>
              </Marker>
            );
          })}

          {tempMarker && <Marker position={tempMarker} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;