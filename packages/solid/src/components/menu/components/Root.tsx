import type { JSX } from 'solid-js'
import type { UseMenuProps } from '../hooks/use-menu'
import type { UsePresenceProps } from '~/components/presence'
import { mergeProps } from '@destyler/solid'
import { createEffect } from 'solid-js'
import {
  PresenceProvider,
  splitPresenceProps,
  usePresence,

} from '~/components/presence'
import { createSplitProps } from '~/utils/create-split-props'
import { useMenu } from '../hooks/use-menu'
import { MenuProvider, useMenuContext } from '../hooks/use-menu-context'
import { MenuMachineProvider, useMenuMachineContext } from '../hooks/use-menu-machine-context'
import { MenuTriggerItemProvider } from '../hooks/use-menu-trigger-item-context'

export interface MenuRootBaseProps extends UseMenuProps, UsePresenceProps {}
export interface MenuRootProps extends MenuRootBaseProps {
  children?: JSX.Element
}

export function MenuRoot(props: MenuRootProps) {
  const [presenceProps, menuProps] = splitPresenceProps(props)
  const [useMenuProps, localProps] = createSplitProps<UseMenuProps>()(menuProps, [
    'anchorPoint',
    'aria-label',
    'closeOnSelect',
    'composite',
    'defaultOpen',
    'highlightedValue',
    'id',
    'ids',
    'loopFocus',
    'onEscapeKeyDown',
    'onFocusOutside',
    'onHighlightChange',
    'onInteractOutside',
    'onOpenChange',
    'onPointerDownOutside',
    'onSelect',
    'open',
    'navigate',
    'positioning',
    'typeahead',
  ])

  const parentApi = useMenuContext()
  const parentMachine = useMenuMachineContext()
  const menu = useMenu(useMenuProps)
  const menuMachine = () => menu.machine
  const presenceApi = usePresence(mergeProps(() => ({ present: menu.api().open }), presenceProps))

  createEffect(() => {
    const machine = parentMachine?.()
    if (!machine)
      return
    parentApi?.().setChild(menu.machine)
    menu.api().setParent(machine)
  })

  const triggerItemContext = () => parentApi?.().getTriggerItemProps(menu.api())

  return (
    <MenuTriggerItemProvider value={triggerItemContext}>
      <MenuMachineProvider value={menuMachine}>
        <MenuProvider value={menu.api}>
          <PresenceProvider value={presenceApi}>{localProps.children}</PresenceProvider>
        </MenuProvider>
      </MenuMachineProvider>
    </MenuTriggerItemProvider>
  )
}
