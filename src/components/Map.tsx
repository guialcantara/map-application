import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { PositionContext } from '../contexts/UsePosition'
import { MyLocationMarker } from './MyLocationMarker'
import Tour from 'reactour'
import useVoronoi from '../useVoronoi'
import VoronoiLayer from './VoronoiLayer'
import { MapPin } from '@phosphor-icons/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { divIcon } from 'leaflet'

const steps = [
  {
    selector: '.input-adress',
    content: 'Here you can type your adress to find your location.',
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
  const [polygons, setPolygons] = useState<any>([])
  const [tourOpen, setTourOpen] = useState(true)

  const { position, firstPosition, setMap } = useContext(PositionContext)

  const {
    MULT_VORONOI,
    setShowVoronoi,
    setEnabledVoronoi,
    getVoronoiPolygons,
  } = useVoronoi()

  async function getNearbyPlaces(lat: number, lng: number, radius = 500) {
    try {
      const baseUrl = `https://api.tomtom.com/search/2/nearbySearch/.json?key=${
        import.meta.env.VITE_TOMTOM_API_KEY
      }`
      const response = await axios.get(
        `${baseUrl}&lat=${lat}&lon=${lng}&radius=${radius}&limit=100&language=pt-BR&categorySet=7315`,
      )
      setPlaces(response.data.results)
      const points = response.data.results.map(
        (place: { position: { lat: number; lon: number } }) => {
          return [
            Number(+place.position.lat.toFixed(7)) * MULT_VORONOI,
            Number(+place.position.lon.toFixed(7)) * MULT_VORONOI,
          ]
        },
      )

      if (points) {
        setPolygons(getVoronoiPolygons(points, position))
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

      <VoronoiLayer
        showVoronoi
        enabledVoronoi
        voronoiPolygons={polygons}
        currentPosition={position}
      />
    </MapContainer>
  )
}
