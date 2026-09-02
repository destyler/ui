import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useMenuTriggerItemContext } from '../hooks/use-menu-trigger-item-context'

export interface MenuTriggerItemBaseProps extends PolymorphicProps<'div'> {}
export interface MenuTriggerItemProps extends HTMLProps<'div'>, MenuTriggerItemBaseProps {}

export function MenuTriggerItem(props: MenuTriggerItemProps) {
  const getTriggerItemProps = useMenuTriggerItemContext()
  const mergedProps = mergeProps(() => getTriggerItemProps?.(), props)

  return <ui.div {...mergedProps} />
}
