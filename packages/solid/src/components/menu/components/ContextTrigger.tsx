import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useMenuContext } from '../hooks/use-menu-context'

export interface MenuContextTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface MenuContextTriggerProps extends HTMLProps<'button'>, MenuContextTriggerBaseProps {}

export function MenuContextTrigger(props: MenuContextTriggerProps) {
  const context = useMenuContext()
  const mergedProps = mergeProps(() => context().getContextTriggerProps(), props)

  return <ui.button {...mergedProps} />
}
