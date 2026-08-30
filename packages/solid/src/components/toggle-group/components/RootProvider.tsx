import type { UseToggleGroupReturn } from '../hooks/use-toggle-group'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { ToggleGroupProvider } from '../hooks/use-toggle-group-context'

interface RootProviderProps {
  value: UseToggleGroupReturn
}

export interface ToggleGroupRootProviderBaseProps extends PolymorphicProps<'div'> {}
export interface ToggleGroupRootProviderProps
  extends HTMLProps<'div'>,
  RootProviderProps,
  ToggleGroupRootProviderBaseProps {}

export function ToggleGroupRootProvider(props: ToggleGroupRootProviderProps) {
  const [{ value: toggleGroup }, localProps] = createSplitProps<RootProviderProps>()(props, [
    'value',
  ])
  const mergedProps = mergeProps(() => toggleGroup().getRootProps(), localProps)

  return (
    <ToggleGroupProvider value={toggleGroup}>
      <ui.div {...mergedProps} />
    </ToggleGroupProvider>
  )
}
