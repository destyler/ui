import type { UseStepsReturn } from '../hooks/use-steps'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { StepsProvider } from '../hooks/use-steps-context'

interface RootProviderProps {
  value: UseStepsReturn
}

export interface StepsRootProviderBaseProps extends RootProviderProps, PolymorphicProps {}
export interface StepsRootProviderProps extends HTMLProps<'div'>, StepsRootProviderBaseProps {}

export const StepsRootProvider = forwardRef<HTMLDivElement, StepsRootProviderProps>((props, ref) => {
  const [{ value: steps }, rootProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(steps.getRootProps(), rootProps)

  return (
    <StepsProvider value={steps}>
      <ui.div {...mergedProps} ref={ref}>
        {props.children}
      </ui.div>
    </StepsProvider>
  )
})

StepsRootProvider.displayName = 'StepsRootProvider'
