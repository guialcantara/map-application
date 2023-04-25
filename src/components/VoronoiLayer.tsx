import React from 'react'
import { LayerGroup, Polyline } from 'react-leaflet'
import useVoronoi from '../useVoronoi'
import { LatLngExpression } from 'leaflet'

const VoronoiLayer = ({
  showVoronoi,
  enabledVoronoi,
  voronoiPolygons,
  currentPosition,
}: any) => {
  const { MULT_VORONOI } = useVoronoi()

  const voronoiBouds: LatLngExpression[] = [
    {
      lat: currentPosition.lat - 0.01,
      lng: currentPosition.lng - 0.01,
    },
    {
      lat: currentPosition.lat + 0.01,
      lng: currentPosition.lng - 0.01,
    },
    {
      lat: currentPosition.lat + 0.01,
      lng: currentPosition.lng + 0.01,
    },
    {
      lat: currentPosition.lat - 0.01,
      lng: currentPosition.lng + 0.01,
    },
    {
      lat: currentPosition.lat - 0.01,
      lng: currentPosition.lng - 0.01,
    },
  ]
  return (
    <>
      {showVoronoi && enabledVoronoi && (
        <LayerGroup>
          {voronoiPolygons && (
            <Polyline
              color="orange"
              positions={voronoiPolygons.map((polygons: any) =>
                polygons.map((point: any) => {
                  return [point[0] / MULT_VORONOI, point[1] / MULT_VORONOI]
                }),
              )}
            />
          )}
          {currentPosition && voronoiPolygons.length > 0 && (
            <Polyline color="orange" positions={voronoiBouds} />
          )}
        </LayerGroup>
      )}
    </>
  )
}

export default VoronoiLayer
