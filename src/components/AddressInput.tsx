import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { PositionContext } from "../contexts/UsePosition";

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay]
  );
  return debouncedValue;
}

export function AddressInput() {
  const [options, setOptions] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const { setPosition, map } = useContext(PositionContext)

  async function generateAutoComplete() {

    const result = await axios.get(`https://api.geoapify.com/v1/geocode/autocomplete?text=${debouncedSearchTerm}&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`)
    setOptions(result.data.features)

  }

  function flyTo(prop: any) {
    setPosition({ lat: prop.lat, lng: prop.lon })
    map.flyTo({ lat: prop.lat, lng: prop.lon })
  }
  useEffect(() => {
    if (debouncedSearchTerm) {
      generateAutoComplete()
    } else {
      setOptions([])
    }
  }, [debouncedSearchTerm])
  return (
    <div className="absolute z-[99999] top-3 left-16 ">
      <input className="group  h-8 w-52 px-2 outline-none" placeholder="type your address..." onChange={(e) => { setSearchTerm(e.target.value) }} type="text" />
      {options.length > 0 && (
        <ul className="divide-y divide-slate-600  border border-slate-600">
          {options.map((option: any) => (
            <li onClick={() => { flyTo(option.properties) }} key={option.properties.place_id} className="h-fit w-52 p-1 bg-white cursor-pointer ">{option.properties.formatted}</li>
          ))}
        </ul>
      )}
    </div>
  )
}