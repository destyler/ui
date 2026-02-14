import type { TriggerProps } from '@destyler/navigation-menu'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'

export interface NavigationMenuTriggerBaseProps extends TriggerProps, PolymorphicProps {}
export interface NavigationMenuTriggerProps extends Omit<HTMLProps<'button'>, 'value'>, NavigationMenuTriggerBaseProps {}

export const NavigationMenuTrigger = forwardRef<HTMLButtonElement, NavigationMenuTriggerProps>((props, ref) => {
  const [triggerProps, localProps] = createSplitProps<TriggerProps>()(props, ['value', 'disabled'])
  const navigationMenu = useNavigationMenuContext()
  const mergedProps = mergeProps(navigationMenu.getTriggerProps(triggerProps), localProps)

  return <ui.button {...mergedProps} ref={ref} />
})

NavigationMenuTrigger.displayName = 'NavigationMenuTrigger'
