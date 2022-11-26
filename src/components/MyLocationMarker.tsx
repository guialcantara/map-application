import { divIcon } from "leaflet"
import { useEffect, useMemo, useRef, useState } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { Circle, LayerGroup, Marker, Popup } from "react-leaflet"
import { MapPin } from 'phosphor-react'

export interface Position {
  lat: number
  lng: number
}

export interface MyLocationMarkerProps {
  coord: Position
  onChangePos?: (coord: Position) => void
}

export function MyLocationMarker({ coord, onChangePos }: MyLocationMarkerProps) {
  const [draggable, setDraggable] = useState(false)
  const [position, setPosition] = useState(coord)
  const circleRef = useRef(null)
  const markerRef = useRef(null)

  const iconMarkup = renderToStaticMarkup(
    <MapPin size={40} color={draggable ? "#0f829f" : "#256114"} weight="fill" />
  );

  const customMarkerIcon = divIcon({
    html: iconMarkup,
    iconAnchor: [20, 40],
    className: "",
    popupAnchor: [-2, -40]
  });


  useEffect(() => {
    if (onChangePos) {
      onChangePos(position)
    }
  }, [position])

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker: any = markerRef.current
        if (marker != null) {
          setPosition(marker.getLatLng())
        }
      },
      drag(e: any) {
        const circle: any = circleRef.current
        circle.setLatLng(e.latlng)
      }
    }),
    [],
  )

  return (

    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={customMarkerIcon}
    >
      <Popup minWidth={90}>
        <span style={{ cursor: 'pointer' }} onClick={() => { setDraggable((d) => !d) }}>
          {draggable
            ? 'Marker is draggable'
            : 'Click here to make marker draggable'}
        </span>
      </Popup>
      <Circle
        center={position}
        ref={circleRef}
        pathOptions={{ color: draggable ? "#0f829f" : "#256114", fillColor: 'green' }}
        radius={500}
      />
    </Marker>

  )
}