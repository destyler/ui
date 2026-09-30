import { cleanProps } from './clean-props'

/** Keep a live open prop authoritative over an uncontrolled initial seed. */
export function cleanOpenProps<T extends { open?: boolean, defaultOpen?: boolean }>(props: T): T {
  const result = cleanProps(props)
  if (result.open !== undefined)
    delete result.defaultOpen
  return result
}
