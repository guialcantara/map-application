import { divIcon } from "leaflet"
import { MapPin } from 'phosphor-react'
import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { Circle, Marker, Popup } from "react-leaflet"
import { PositionContext } from "../contexts/UsePosition"


export function MyLocationMarker() {
  const [draggable, setDraggable] = useState(false)
  const circleRef = useRef(null)
  const markerRef = useRef(null)
  const { position, setPosition } = useContext(PositionContext)
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
    setPosition(position)
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