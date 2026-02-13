import type { ItemGroupProps } from '@destyler/menu'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Optional } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef, useId } from 'react'
import { createSplitProps } from '~/utils/create-split-props'
import { ui } from '~/factory'
import { useMenuContext } from '../hooks/use-menu-context'
import { MenuItemGroupProvider } from '../hooks/use-menu-item-group-context'

type OptionalItemGroupProps = Optional<ItemGroupProps, 'id'>

export interface MenuItemGroupBaseProps extends OptionalItemGroupProps, PolymorphicProps {}
export interface MenuItemGroupProps extends HTMLProps<'div'>, MenuItemGroupBaseProps {}

export const MenuItemGroup = forwardRef<HTMLDivElement, MenuItemGroupProps>((props, ref) => {
  const [optionalItemGroupProps, localProps] = createSplitProps<OptionalItemGroupProps>()(props, ['id'])
  const menu = useMenuContext()
  const id = useId()
  const itemGroupProps = { id, ...optionalItemGroupProps }
  const mergedProps = mergeProps(menu.getItemGroupProps(itemGroupProps), localProps)

  return (
    <MenuItemGroupProvider value={itemGroupProps}>
      <ui.div {...mergedProps} ref={ref} />
    </MenuItemGroupProvider>
  )
})

MenuItemGroup.displayName = 'MenuItemGroup'
