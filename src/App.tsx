import { AppShell } from './app/AppShell'
import { MapProvider } from './map/MapProvider'
import { RestaurantsProvider } from './restaurants/RestaurantsProvider'

export default function App() {
  return (
    <RestaurantsProvider>
      <MapProvider>
        <AppShell />
      </MapProvider>
    </RestaurantsProvider>
  )
}
