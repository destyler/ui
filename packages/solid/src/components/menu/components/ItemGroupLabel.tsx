import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useMenuContext } from '../hooks/use-menu-context'
import { useMenuItemGroupContext } from '../hooks/use-menu-item-group-context'

export interface MenuItemGroupLabelBaseProps extends PolymorphicProps<'div'> {}
export interface MenuItemGroupLabelProps extends HTMLProps<'div'>, MenuItemGroupLabelBaseProps {}

export function MenuItemGroupLabel(props: MenuItemGroupLabelProps) {
  const context = useMenuContext()
  const itemGroupContext = useMenuItemGroupContext()
  const mergedProps = mergeProps(
    context().getItemGroupLabelProps({ htmlFor: itemGroupContext.id }),
    props,
  )

  return <ui.div {...mergedProps} />
}
