import type { ItemProps } from '@destyler/menu'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { createMemo } from 'solid-js'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useMenuContext } from '../hooks/use-menu-context'
import { MenuItemProvider } from '../hooks/use-menu-item-context'

export interface MenuItemBaseProps extends ItemProps, PolymorphicProps<'div'> {}
export interface MenuItemProps extends HTMLProps<'div'>, MenuItemBaseProps {}

export function MenuItem(props: MenuItemProps) {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, [
    'closeOnSelect',
    'disabled',
    'value',
    'valueText',
  ])
  const context = useMenuContext()
  const mergedProps = mergeProps(() => context().getItemProps(itemProps), localProps)
  const itemState = createMemo(() => context().getItemState(itemProps))

  return (
    <MenuItemProvider value={itemState}>
      <ui.div {...mergedProps} />
    </MenuItemProvider>
  )
}
