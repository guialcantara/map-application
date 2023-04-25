import { useState } from 'react'
import { voronoi } from 'd3-voronoi'

const useVoronoi = () => {
  const [showVoronoi, setShowVoronoi] = useState<any>(false)
  const [enabledVoronoi, setEnabledVoronoi] = useState<any>(false)

  const MULT_VORONOI = 1000

  function getVoronoiPolygons(data: any, position: any) {
    if (data.length > 0) {
      try {
        const vor = voronoi().extent([
          [
            (position.lat - 0.01) * MULT_VORONOI,
            (position.lng - 0.01) * MULT_VORONOI,
          ],
          [
            (position.lat + 0.01) * MULT_VORONOI,
            (position.lng + 0.01) * MULT_VORONOI,
          ],
        ])

        const polygons = vor(data).polygons()

        const voronoiPolygons =
          polygons && polygons.filter((x: any) => Array.isArray(x))

        return voronoiPolygons
      } catch (error) {
        console.error(error)
      }
    }
    return []
  }
  return {
    showVoronoi,
    setShowVoronoi,
    enabledVoronoi,
    setEnabledVoronoi,
    getVoronoiPolygons,
    MULT_VORONOI,
  }
}

export default useVoronoi
