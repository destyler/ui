import type { JSX } from 'solid-js'
import type { UseStepsContext } from '../hooks/use-steps-context'
import { useStepsContext } from '../hooks/use-steps-context'

export interface StepsContextProps {
  children: (context: UseStepsContext) => JSX.Element
}

export function StepsContext(props: StepsContextProps) {
  const context = useStepsContext()
  return props.children(context)
}
