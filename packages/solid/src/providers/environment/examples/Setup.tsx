import { EnvironmentProvider } from '@destyler-ui/solid/environment'

export function App() {
  return (
    <iframe title="IFrame Context">
      <EnvironmentProvider>{/* Your App */}</EnvironmentProvider>
    </iframe>
  )
}
