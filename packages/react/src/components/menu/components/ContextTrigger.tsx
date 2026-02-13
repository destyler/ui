import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useMenuContext } from '../hooks/use-menu-context'

export interface MenuContextTriggerBaseProps extends PolymorphicProps {}
export interface MenuContextTriggerProps extends HTMLProps<'button'>, MenuContextTriggerBaseProps {}

export const MenuContextTrigger = forwardRef<HTMLButtonElement, MenuContextTriggerProps>((props, ref) => {
  const menu = useMenuContext()
  const mergedProps = mergeProps(menu.getContextTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

MenuContextTrigger.displayName = 'MenuContextTrigger'
