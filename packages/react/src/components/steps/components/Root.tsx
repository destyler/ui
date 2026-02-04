import type { UseStepsProps } from '../hooks/use-steps'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { splitStepsProps } from '../hooks/split-steps-props'
import { useSteps } from '../hooks/use-steps'
import { StepsProvider } from '../hooks/use-steps-context'

export interface StepsRootBaseProps extends UseStepsProps, PolymorphicProps {}
export interface StepsRootProps extends HTMLProps<'div'>, StepsRootBaseProps {}

export const StepsRoot = forwardRef<HTMLDivElement, StepsRootProps>((props, ref) => {
  const [useStepsProps, localProps] = splitStepsProps(props)
  const steps = useSteps(useStepsProps)
  const mergedProps = mergeProps(steps.getRootProps(), localProps)

  return (
    <StepsProvider value={steps}>
      <ui.div {...mergedProps} ref={ref} />
    </StepsProvider>
  )
})

StepsRoot.displayName = 'StepsRoot'
