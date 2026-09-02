import type { TriggerProps } from '@destyler/navigation-menu'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/solid'
import { createMemo, splitProps } from 'solid-js'
import { ui } from '~/factory'
import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'
import { useNavigationMenuItemPropsContext } from '../hooks/use-navigation-menu-item-props-context'

export interface NavigationMenuTriggerBaseProps
  extends Partial<TriggerProps>,
  PolymorphicProps<'button'> {}
export interface NavigationMenuTriggerProps
  extends Assign<HTMLProps<'button'>, NavigationMenuTriggerBaseProps> {}

export function NavigationMenuTrigger(props: NavigationMenuTriggerProps) {
  const [triggerProps, localProps] = splitProps(props, ['disabled', 'value'])
  const navigationMenu = useNavigationMenuContext()
  const itemProps = useNavigationMenuItemPropsContext()
  const resolvedProps = createMemo<TriggerProps>(() => {
    const value = triggerProps.value ?? itemProps?.().value
    if (value === undefined) {
      const error = new Error(
        'NavigationMenu.Trigger requires a value prop or a parent NavigationMenu.Item',
      )
      error.name = 'ContextError'
      throw error
    }
    return { disabled: triggerProps.disabled, value }
  })
  const mergedProps = mergeProps(
    () => navigationMenu().getTriggerProps(resolvedProps()),
    localProps,
  )

  return <ui.button {...mergedProps} />
}
