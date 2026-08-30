import type { JSX } from 'solid-js'
import { createEffect, onCleanup } from 'solid-js'

interface FrameContentProps {
  onMount?: () => void
  onUnmount?: () => void
  children?: JSX.Element
}

export function FrameContent(props: FrameContentProps) {
  const { onMount, onUnmount, children } = props

  createEffect(() => {
    onMount?.()

    onCleanup(() => {
      onUnmount?.()
    })
  })

  return children
}
