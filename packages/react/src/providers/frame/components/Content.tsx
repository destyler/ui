import { useEffect } from 'react'

interface FrameContentProps {
  onMount?: () => void
  onUnmount?: () => void
  children?: React.ReactNode
}

export function FrameContent(props: FrameContentProps) {
  const { onMount, onUnmount, children } = props
  useEffect(() => {
    // StrictMode replays effects as setup → cleanup → setup. Every cleanup
    // needs a matching setup while the frame content remains mounted.
    onMount?.()
    return () => onUnmount?.()
  }, [])

  return children
}
