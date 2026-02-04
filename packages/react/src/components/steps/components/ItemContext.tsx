import type { ReactNode } from 'react'
import type { UseStepsItemContext } from '../hooks/use-steps-item-context'
import { useStepsItemContext } from '../hooks/use-steps-item-context'

export interface StepsItemContextProps {
  children: (context: UseStepsItemContext) => ReactNode
}

export function StepsItemContext(props: StepsItemContextProps) {
  return props.children(useStepsItemContext())
}

StepsItemContext.displayName = 'StepsItemContext'
