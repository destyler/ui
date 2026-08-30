import { EnvironmentProvider } from '@destyler-ui/solid/environment'
import { Usage } from './Usage'

export function Basic() {
  return (
    <EnvironmentProvider>
      <Usage />
    </EnvironmentProvider>
  )
}
