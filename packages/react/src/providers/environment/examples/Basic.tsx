import { EnvironmentProvider } from '../index'
import { Usage } from './Usage'

export function Basic() {
  return (
    <EnvironmentProvider>
      <Usage />
    </EnvironmentProvider>
  )
}
