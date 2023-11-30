import { AddressInput } from './components/AddressInput'
import { Map } from './components/Map'
import { PositionContextProvider } from './contexts/UsePosition'
import { VoronoiContextProvider } from './contexts/useVoronoi'
import './styles/main.css'

function App() {
  return (
    <div>
      <PositionContextProvider>
        <VoronoiContextProvider>
          <Map />
          <AddressInput />
        </VoronoiContextProvider>
      </PositionContextProvider>
    </div>
  )
}

export default App
