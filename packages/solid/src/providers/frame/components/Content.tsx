import type { JSX } from 'solid-js'
import { onCleanup, onMount } from 'solid-js'

interface FrameContentProps {
  onMount?: () => void
  onUnmount?: () => void
  children?: JSX.Element
}

export function FrameContent(props: FrameContentProps) {
  onMount(() => {
    props.onMount?.()

    onCleanup(() => {
      props.onUnmount?.()
    })
  })

  return <>{props.children}</>
}
