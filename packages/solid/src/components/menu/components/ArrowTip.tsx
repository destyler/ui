import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useMenuContext } from '../hooks/use-menu-context'

export interface MenuArrowTipBaseProps extends PolymorphicProps<'div'> {}
export interface MenuArrowTipProps extends HTMLProps<'div'>, MenuArrowTipBaseProps {}

export function MenuArrowTip(props: MenuArrowTipProps) {
  const context = useMenuContext()
  const mergedProps = mergeProps(() => context().getArrowTipProps(), props)

  return <ui.div {...mergedProps} />
}
