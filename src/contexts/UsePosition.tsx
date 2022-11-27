import axios from "axios";
import { createContext, ReactNode, useEffect, useState } from "react";

export interface Position {
  lat: number,
  lng: number
}

interface PositionContextType {
  position: Position
  firstPosition: Position
  setPosition: (pos: Position) => void
  map: any
  setMap: (map: any) => void
}

export const PositionContext = createContext({} as PositionContextType)

interface PositionContextProviderProps {
  children: ReactNode
}

export function PositionContextProvider({
  children,
}: PositionContextProviderProps) {

  const [position, setPosition] = useState({} as Position)
  const [map, setMap] = useState()
  const [firstPosition, setFirstPosition] = useState({} as Position)

  async function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition({ lat: coords.latitude, lng: coords.longitude });
        setFirstPosition({ lat: coords.latitude, lng: coords.longitude });
      },
      (blocked) => {
        if (blocked) {
          async function fetch() {
            try {
              const { data } = await axios.get("https://ipapi.co/json");
              setPosition({ lat: data.latitude, lng: data.longitude });
              setFirstPosition({ lat: data.latitude, lng: data.longitude })
            } catch (err) {
              console.error(err);
            }
          };
          fetch();
        }
      }
    );
  }
  useEffect(() => {
    getCurrentLocation()
  }, [])
  return (
    <PositionContext.Provider value={{ firstPosition, position, setPosition, map, setMap }}>
      {children}
    </PositionContext.Provider>
  )
}