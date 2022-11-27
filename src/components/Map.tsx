import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { PositionContext } from '../contexts/UsePosition';
import { AddressInput } from './AddressInput';
import { MyLocationMarker } from './MyLocationMarker';

export function Map() {
  const [places, setPlaces] = useState([])

  const { position, firstPosition, setMap } = useContext(PositionContext)

  async function getNearbyPlaces(lat: number, lng: number, radius = 500) {
    try {
      let baseUrl = `https://api.tomtom.com/search/2/nearbySearch/.json?key=${import.meta.env.VITE_TOMTOM_API_KEY}`
      let response = await axios.get(`${baseUrl}&lat=${lat}&lon=${lng}&radius=${radius}&limit=100&language=pt-BR&categorySet=7315`);
      setPlaces(response.data.results)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (position.lat && position.lng) {
      getNearbyPlaces(position.lat, position.lng)
    }
  }, [position])


  if (!position.lat && !position.lng) {
    return <h2>loading...</h2>
  }

  return (
    <MapContainer ref={setMap} className='w-screen h-screen' center={firstPosition} zoom={16} >

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      <MyLocationMarker />

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
