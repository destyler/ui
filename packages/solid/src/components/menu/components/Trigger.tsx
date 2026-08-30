import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useMenuContext } from '../hooks/use-menu-context'

export interface MenuTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface MenuTriggerProps extends HTMLProps<'button'>, MenuTriggerBaseProps {}

export function MenuTrigger(props: MenuTriggerProps) {
  const api = useMenuContext()
  const presenceApi = usePresenceContext()
  const mergedProps = mergeProps(
    () => api().getTriggerProps(),
    () => ({ 'aria-controls': presenceApi().unmounted && null }),
    props,
  )
  return <ui.button {...mergedProps} />
}
