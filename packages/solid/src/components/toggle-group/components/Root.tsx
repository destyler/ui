import type { UseToggleGroupProps } from '../hooks/use-toggle-group'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useToggleGroup } from '../hooks/use-toggle-group'
import { ToggleGroupProvider } from '../hooks/use-toggle-group-context'

export interface ToggleGroupRootBaseProps extends UseToggleGroupProps, PolymorphicProps<'div'> {}
export interface ToggleGroupRootProps extends HTMLProps<'div'>, ToggleGroupRootBaseProps {}

export function ToggleGroupRoot(props: ToggleGroupRootProps) {
  const [useToggleGroupProps, restProps] = createSplitProps<UseToggleGroupProps>()(props, [
    'defaultValue',
    'disabled',
    'id',
    'ids',
    'loopFocus',
    'multiple',
    'onValueChange',
    'orientation',
    'rovingFocus',
    'value',
  ])

  const api = useToggleGroup(useToggleGroupProps)
  const mergedProps = mergeProps(() => api().getRootProps(), restProps)

  return (
    <ToggleGroupProvider value={api}>
      <ui.div {...mergedProps} />
    </ToggleGroupProvider>
  )
}
