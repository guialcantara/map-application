import { MapPin } from '@phosphor-icons/react'
import axios from 'axios'
import { divIcon } from 'leaflet'
import { useContext, useEffect, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import Tour from 'reactour'
import { PositionContext } from '../contexts/UsePosition'
import { MyLocationMarker } from './MyLocationMarker'
import VoronoiLayer from './VoronoiLayer'
import { VoronoiContext } from '../contexts/useVoronoi'

const steps = [
  {
    selector: '.input-address',
    content: 'Here you can type your address to find your location.',
  },
  {
    selector: '.my-location',
    content: 'This is your location in the map',
  },
  {
    selector: '.my-location-area',
    content: 'This is the area that application will look for restaurants.',
  },
  {
    selector: '.restaurant',
    content: 'This is a restaurant location.',
  },
]

export function Map() {
  const [places, setPlaces] = useState([])
  const [tourOpen, setTourOpen] = useState(true)

  const { position, firstPosition, setMap } = useContext(PositionContext)

  const { setShowVoronoi, setEnabledVoronoi, setPoints } =
    useContext(VoronoiContext)

  async function getNearbyPlaces(lat: number, lng: number, radius = 500) {
    try {
      const baseUrl = `https://api.tomtom.com/search/2/nearbySearch/.json?key=${
        import.meta.env.VITE_TOMTOM_API_KEY
      }`
      const response = await axios.get(
        `${baseUrl}&lat=${lat}&lon=${lng}&radius=${radius}&limit=100&language=pt-BR&categorySet=7315`,
      )
      setPlaces(response.data.results)
      const points = response.data.results.flatMap(
        (place: { position: { lat: number; lon: number } }) => [
          Number(+place.position.lat.toFixed(7)),
          Number(+place.position.lon.toFixed(7)),
        ],
      )

      if (points) {
        setPoints(points)
        setEnabledVoronoi(true)
        setShowVoronoi(true)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (position.lat && position.lng) {
      getNearbyPlaces(position.lat, position.lng)
    }
  }, [position])// eslint-disable-line

  if (!position.lat && !position.lng) {
    return <h2>loading...</h2>
  }

  function closeTour() {
    setTourOpen(false)
  }

  const iconMarkup = renderToStaticMarkup(
    <MapPin className="restaurant" size={40} color="#dba800" weight="fill" />,
  )

  const customMarkerIcon = divIcon({
    html: iconMarkup,
    iconAnchor: [20, 40],
    className: '',
    popupAnchor: [-2, -40],
  })

  return (
    <MapContainer
      ref={setMap}
      className="w-screen h-screen"
      center={firstPosition}
      zoom={16}
    >
      <Tour steps={steps} isOpen={tourOpen} onRequestClose={closeTour} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      <MyLocationMarker />

      {places.map((place: any) => (
        <Marker
          opacity={1}
          key={place.id}
          icon={customMarkerIcon}
          position={place.position}
        >
          <Popup minWidth={90}>
            <span>{place.poi.name}</span>
          </Popup>
        </Marker>
      ))}

      <VoronoiLayer showVoronoi enabledVoronoi currentPosition={position} />
    </MapContainer>
  )
}
