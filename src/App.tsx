
import { AddressInput } from './components/AddressInput';
import { Map } from './components/Map';
import { PositionContextProvider } from './contexts/UsePosition';
import './styles/main.css';

function App() {

  return (
    <div >
      <PositionContextProvider>
        <Map />
        <AddressInput />
      </PositionContextProvider>
    </div>
  )
}

export default App
