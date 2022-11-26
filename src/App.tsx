
import axios from 'axios';
import { useEffect, useState } from 'react';
import { TileLayer, MapContainer, Marker, Popup, useMap } from 'react-leaflet'
import { MyLocationMarker, Position } from './components/MyLocationMarker';

interface MapControlProps {
  position: Position
}

function MapControl({ position }: MapControlProps) {
  const map = useMap()
  useEffect(() => {
    map.setView(position)
  }, [position])
  return null
}

function App() {
  const [pos, setPos] = useState({} as Position)
  const [places, setPlaces] = useState([])

  async function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPos({ lat: coords.latitude, lng: coords.longitude });
      },
      (blocked) => {
        if (blocked) {
          async function fetch() {
            try {
              const { data } = await axios.get("https://ipapi.co/json");
              setPos({ lat: data.latitude, lng: data.longitude });
            } catch (err) {
              console.error(err);
            }
          };
          fetch();
        }
      }
    );
  }

  async function getNearbyPlaces(lat: number, lng: number, radius = 500) {
    try {
      let baseUrl = "https://api.tomtom.com/search/2/nearbySearch/.json?key=G4QY8WyAaNKvgc2Gut4ktVeiHxOpuAYJ"
      let response = await axios.get(`${baseUrl}&lat=${lat}&lon=${lng}&radius=${radius}&limit=100&language=pt-BR&categorySet=7315`);
      setPlaces(response.data.results)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (pos.lat && pos.lng) {
      getNearbyPlaces(pos.lat, pos.lng)
    }
  }, [pos])

  useEffect(() => {
    getCurrentLocation()
  }, [])

  if (!pos.lat && !pos.lng) {
    return <h2>loading...</h2>
  }

  return (
    <MapContainer center={pos} zoom={16} style={{ minHeight: "90vh", minWidth: "90vw" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <MyLocationMarker coord={pos} onChangePos={(coord) => { setPos(coord) }} />
      <MapControl position={pos} />
      {places.map((place: any) => (
        <Marker
          opacity={0.5}
          key={place.id}
          position={place.position}>
          <Popup minWidth={90}>
            <span >
              {place.poi.name}
            </span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default App
