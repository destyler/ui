import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useMenuContext } from '../hooks/use-menu-context'

export interface MenuArrowBaseProps extends PolymorphicProps<'div'> {}
export interface MenuArrowProps extends HTMLProps<'div'>, MenuArrowBaseProps {}

export function MenuArrow(props: MenuArrowProps) {
  const context = useMenuContext()
  const mergedProps = mergeProps(() => context().getArrowProps(), props)

  return <ui.div {...mergedProps} />
}
