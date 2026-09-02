import type { JSX } from 'solid-js'
import { createSignal, onMount, Show } from 'solid-js'

export interface ClientOnlyProps {
  children: JSX.Element
  fallback?: JSX.Element
}

export function ClientOnly(props: ClientOnlyProps) {
  const [isClient, setIsClient] = createSignal(false)

  onMount(() => {
    setIsClient(true)
  })

  return (
    <Show when={isClient()} fallback={props.fallback}>
      {props.children}
    </Show>
  )
}
