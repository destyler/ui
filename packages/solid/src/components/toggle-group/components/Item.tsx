import type { ItemProps } from '@destyler/toggle'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useToggleGroupContext } from '../hooks/use-toggle-group-context'

export interface ToggleGroupItemBaseProps extends ItemProps, PolymorphicProps<'button'> {}
export interface ToggleGroupItemProps
  extends Assign<HTMLProps<'button'>, ToggleGroupItemBaseProps> {}

export function ToggleGroupItem(props: ToggleGroupItemProps) {
  const [toggleProps, restProps] = createSplitProps<ItemProps>()(props, ['value', 'disabled'])
  const api = useToggleGroupContext()
  const mergedProps = mergeProps(() => api().getItemProps(toggleProps), restProps)

  return <ui.button {...mergedProps} />
}
