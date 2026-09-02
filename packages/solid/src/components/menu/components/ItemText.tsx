import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useMenuContext } from '../hooks/use-menu-context'
import { useMenuOptionItemPropsContext } from '../hooks/use-menu-option-item-props-context'

export interface MenuItemTextBaseProps extends PolymorphicProps<'div'> {}
export interface MenuItemTextProps extends HTMLProps<'div'>, MenuItemTextBaseProps {}

export function MenuItemText(props: MenuItemTextProps) {
  const context = useMenuContext()
  const optionItemProps = useMenuOptionItemPropsContext()
  const mergedProps = mergeProps(() => context().getItemTextProps(optionItemProps), props)

  return <ui.div {...mergedProps} />
}
