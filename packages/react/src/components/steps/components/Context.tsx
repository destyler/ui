import type { ReactNode } from 'react'
import type { UseStepsContext } from '../hooks/use-steps-context'
import { useStepsContext } from '../hooks/use-steps-context'

export interface StepsContextProps {
  children: (context: UseStepsContext) => ReactNode
}

export function StepsContext(props: StepsContextProps) {
  const context = useStepsContext()
  return props.children(context)
}

StepsContext.displayName = 'StepsContext'
