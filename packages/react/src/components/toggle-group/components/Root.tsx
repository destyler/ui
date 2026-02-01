import type { UseToggleGroupProps } from '../hooks/use-toggle-group'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useToggleGroup } from '../hooks/use-toggle-group'
import { ToggleGroupProvider } from '../hooks/use-toggle-group-context'

export interface ToggleGroupRootBaseProps extends UseToggleGroupProps, PolymorphicProps {}
export interface ToggleGroupRootProps extends Assign<HTMLProps<'div'>, ToggleGroupRootBaseProps> {}

export const ToggleGroupRoot = forwardRef<HTMLDivElement, ToggleGroupRootProps>((props, ref) => {
  const [useToggleGroupProps, localProps] = createSplitProps<UseToggleGroupProps>()(props, [
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
  const togglegroup = useToggleGroup(useToggleGroupProps)
  const mergedProps = mergeProps(togglegroup.getRootProps(), localProps)

  return (
    <ToggleGroupProvider value={togglegroup}>
      <ui.div {...mergedProps} ref={ref} />
    </ToggleGroupProvider>
  )
})

ToggleGroupRoot.displayName = 'ToggleGroupRoot'
