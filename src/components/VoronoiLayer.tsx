import { useContext, useEffect } from 'react'
import { LayerGroup, Polygon, useMap } from 'react-leaflet'
import { VoronoiContext } from '../contexts/useVoronoi'

const VoronoiLayer = ({ showVoronoi, enabledVoronoi, points }: any) => {
  const map = useMap()

  const { setBounds, polygons } = useContext(VoronoiContext)
  useEffect(() => {
    const handleViewportChanged = () => {
      const bounds = map.getBounds()
      setBounds([
        bounds.getSouthWest().lat,
        bounds.getSouthWest().lng,
        bounds.getNorthEast().lat,
        bounds.getNorthEast().lng,
      ])
    }

    map.on('moveend', handleViewportChanged)

    return () => {
      map.off('moveend', handleViewportChanged)
    }
  }, [map]) // eslint-disable-line

  return (
    <>
      {showVoronoi && enabledVoronoi && (
        <LayerGroup>
          {polygons && (
            <Polygon
              pathOptions={{ color: 'orange', fill: false }}
              positions={polygons.map((polygons: any) =>
                polygons.map((point: any) => {
                  return [point[0], point[1]]
                }),
              )}
            />
          )}
        </LayerGroup>
      )}
    </>
  )
}

export default VoronoiLayer
