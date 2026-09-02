import type { JSX } from 'solid-js'

export function orFallback(children: JSX.Element | undefined, fallback: JSX.Element): JSX.Element {
  if (children == null || children === false || children === true)
    return fallback
  return children
}
