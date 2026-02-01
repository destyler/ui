import type { ItemProps } from '@destyler/toggle'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useToggleGroupContext } from '../hooks/use-toggle-group-context'

export interface ToggleGroupItemBaseProps extends ItemProps, PolymorphicProps {}
export interface ToggleGroupItemProps extends Assign<HTMLProps<'button'>, ToggleGroupItemBaseProps> {}

export const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleGroupItemProps>((props, ref) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['value', 'disabled'])
  const toggleGroup = useToggleGroupContext()
  const mergedProps = mergeProps(toggleGroup.getItemProps(itemProps), localProps)

  return <ui.button {...mergedProps} ref={ref} />
})

ToggleGroupItem.displayName = 'ToggleGroupItem'
