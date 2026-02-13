import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useMenuContext } from '../hooks/use-menu-context'
import { useMenuOptionItemPropsContext } from '../hooks/use-menu-option-item-props-context'

export interface MenuItemTextBaseProps extends PolymorphicProps {}
export interface MenuItemTextProps extends HTMLProps<'div'>, MenuItemTextBaseProps {}

export const MenuItemText = forwardRef<HTMLDivElement, MenuItemTextProps>((props, ref) => {
  const menu = useMenuContext()
  const optionItemProps = useMenuOptionItemPropsContext()
  const mergedProps = mergeProps(menu.getItemTextProps(optionItemProps), props)

  return <ui.div {...mergedProps} ref={ref} />
})

MenuItemText.displayName = 'MenuItemText'
