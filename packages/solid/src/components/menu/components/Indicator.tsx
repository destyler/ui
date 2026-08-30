import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useMenuContext } from '../hooks/use-menu-context'

export interface MenuIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface MenuIndicatorProps extends HTMLProps<'div'>, MenuIndicatorBaseProps {}

export function MenuIndicator(props: MenuIndicatorProps) {
  const context = useMenuContext()
  const mergedProps = mergeProps(() => context().getIndicatorProps(), props)

  return <ui.div {...mergedProps} />
}
