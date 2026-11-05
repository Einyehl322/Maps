import { AppShell } from './app/AppShell'
import { AuthGate } from './auth/AuthGate'
import { MapProvider } from './map/MapProvider'
import { RestaurantsProvider } from './restaurants/RestaurantsProvider'

export default function App() {
  return (
    <AuthGate>
      <RestaurantsProvider>
        <MapProvider>
          <AppShell />
        </MapProvider>
      </RestaurantsProvider>
    </AuthGate>
  )
}
