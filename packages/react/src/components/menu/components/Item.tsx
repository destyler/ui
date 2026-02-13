import type { ItemProps } from '@destyler/menu'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useMenuContext } from '../hooks/use-menu-context'
import { MenuItemProvider } from '../hooks/use-menu-item-context'

export interface MenuItemBaseProps extends ItemProps, PolymorphicProps {}
export interface MenuItemProps extends HTMLProps<'div'>, MenuItemBaseProps {}

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>((props, ref) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, [
    'closeOnSelect',
    'disabled',
    'value',
    'valueText',
  ])

  const menu = useMenuContext()
  const mergedProps = mergeProps(menu.getItemProps(itemProps), localProps)
  const itemState = menu.getItemState(itemProps)

  return (
    <MenuItemProvider value={itemState}>
      <ui.div {...mergedProps} ref={ref} />
    </MenuItemProvider>
  )
})

MenuItem.displayName = 'MenuItem'
