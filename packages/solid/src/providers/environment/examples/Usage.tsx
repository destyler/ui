import { useEnvironmentContext } from '../use-environment-context'

export function Usage() {
  const environment = useEnvironmentContext()

  return <pre>{JSON.stringify(environment().getRootNode(), null, 2)}</pre>
}
