import type { ContextProps } from '../types'
import { useAspectRatioContext } from '../hooks/use-aspect-ratio-context'

export function Context(props: ContextProps) {
  const { children } = props
  const aspectRatio = useAspectRatioContext()

  return <>{children(aspectRatio)}</>
}

Context.displayName = 'AspectRatioContext'
