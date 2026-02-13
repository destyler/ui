import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useMenuContext } from '../hooks/use-menu-context'
import { useMenuItemGroupContext } from '../hooks/use-menu-item-group-context'

export interface MenuItemGroupLabelBaseProps extends PolymorphicProps {}
export interface MenuItemGroupLabelProps extends HTMLProps<'div'>, MenuItemGroupLabelBaseProps {}

export const MenuItemGroupLabel = forwardRef<HTMLDivElement, MenuItemGroupLabelProps>((props, ref) => {
  const menu = useMenuContext()
  const itemGroup = useMenuItemGroupContext()
  const mergedProps = mergeProps(menu.getItemGroupLabelProps({ htmlFor: itemGroup.id }), props)

  return <ui.div {...mergedProps} ref={ref} />
})

MenuItemGroupLabel.displayName = 'MenuItemGroupLabel'
