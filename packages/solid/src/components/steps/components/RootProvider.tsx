import type { UseStepsReturn } from '../hooks/use-steps'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { StepsProvider } from '../hooks/use-steps-context'

interface RootProviderProps {
  value: UseStepsReturn
}

export interface StepsRootProviderBaseProps extends RootProviderProps, PolymorphicProps<'div'> {}
export interface StepsRootProviderProps extends HTMLProps<'div'>, StepsRootProviderBaseProps {}

export function StepsRootProvider(props: StepsRootProviderProps) {
  const [{ value: steps }, rootProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(() => steps().getRootProps(), rootProps)

  return (
    <StepsProvider value={steps}>
      <ui.div {...mergedProps}>{props.children}</ui.div>
    </StepsProvider>
  )
}
