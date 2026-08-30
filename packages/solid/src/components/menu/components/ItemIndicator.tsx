import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useMenuContext } from '../hooks/use-menu-context'
import { useMenuOptionItemPropsContext } from '../hooks/use-menu-option-item-props-context'

export interface MenuItemIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface MenuItemIndicatorProps extends HTMLProps<'div'>, MenuItemIndicatorBaseProps {}

export function MenuItemIndicator(props: MenuItemIndicatorProps) {
  const context = useMenuContext()
  const optionItemProps = useMenuOptionItemPropsContext()
  const mergedProps = mergeProps(() => context().getItemIndicatorProps(optionItemProps), props)

  return <ui.div {...mergedProps} />
}
