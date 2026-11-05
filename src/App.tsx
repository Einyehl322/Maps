import { AppShell } from './app/AppShell'
import { AuthGate } from './auth/AuthGate'
import { MapProvider } from './map/MapProvider'
import { MenuLookupsProvider } from './restaurants/menuLookups'
import { RestaurantsProvider } from './restaurants/RestaurantsProvider'

export default function App() {
  return (
    <AuthGate>
      <RestaurantsProvider>
        <MenuLookupsProvider>
          <MapProvider>
            <AppShell />
          </MapProvider>
        </MenuLookupsProvider>
      </RestaurantsProvider>
    </AuthGate>
  )
}
