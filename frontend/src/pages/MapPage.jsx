import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import { useSearch } from '../contexts/SearchContext';

const MapPage = () => {
  const [stations, setStations] = useState([]);
  const { searchTerm } = useSearch();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/stations`).then(res => setStations(res.data));
  }, []);

  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.activities.some(activity => activity.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleVolunteer = (stationId) => {
    axios.post(`${import.meta.env.VITE_API_URL}/api/stations/${stationId}/volunteer-request`, {userName: 'Guest', message: 'Interested in volunteering'});
    alert('Volunteer request submitted!');
  };

  return (
    <div className="container p-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-center mb-12 title">🗺️ STEAM Stations</h1>
        <MapContainer center={[10.776, 106.700]} zoom={13} style={{height: '600px', borderRadius: '8px'}}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {filteredStations.map(station => (
            <Marker key={station.id} position={[station.location.lat, station.location.lng]}>
              <Popup>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{station.name}</h3>
                  <p className="mb-2">Activities: {station.activities.join(', ')}</p>
                  {station.volunteersNeeded && (
                    <button onClick={() => handleVolunteer(station.id)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">
                      Request to Volunteer
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;