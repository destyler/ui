import { useEnvironmentContext } from '../index'

export function Usage() {
  const { getRootNode } = useEnvironmentContext()

  return <pre>{JSON.stringify(getRootNode(), null, 2)}</pre>
}
