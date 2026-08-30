import type { JSX } from 'solid-js'
import type { UseStepsItemContext } from '../hooks/use-steps-item-context'
import { useStepsItemContext } from '../hooks/use-steps-item-context'

export interface StepsItemContextProps {
  children: (context: UseStepsItemContext) => JSX.Element
}

export function StepsItemContext(props: StepsItemContextProps) {
  return props.children(useStepsItemContext())
}

StepsItemContext.displayName = 'StepsItemContext'
