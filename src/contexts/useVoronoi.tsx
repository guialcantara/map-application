import { ReactNode, createContext, useEffect, useState } from 'react'
import { Delaunay } from 'd3-delaunay'

export const VoronoiContext = createContext({} as any)

export function VoronoiContextProvider({ children }: { children: ReactNode }) {
  const [showVoronoi, setShowVoronoi] = useState<any>(false)
  const [points, setPoints] = useState<any>([])
  const [bounds, setBounds] = useState<any>([])
  const [polygons, setPolygons] = useState<any>([])
  const [enabledVoronoi, setEnabledVoronoi] = useState<any>(false)

  function getVoronoiPolygons() {
    if (points.length > 0 && bounds.length > 0) {
      try {
        const delaunay = new Delaunay(points)

        const d3voronoi = delaunay.voronoi(bounds)
        setPolygons(Array.from(d3voronoi.cellPolygons()))
      } catch (error) {
        console.error(error)
      }
    } else {
      setPolygons([])
    }
  }

  useEffect(() => {
    getVoronoiPolygons()
  }, [bounds, points]) // eslint-disable-line

  return (
    <VoronoiContext.Provider
      value={{
        showVoronoi,
        setShowVoronoi,
        enabledVoronoi,
        setEnabledVoronoi,
        getVoronoiPolygons,
        setPoints,
        setBounds,
        polygons,
      }}
    >
      {children}
    </VoronoiContext.Provider>
  )
}
