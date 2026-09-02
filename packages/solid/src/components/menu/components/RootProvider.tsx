import type { JSX } from 'solid-js'
import type { UseMenuReturn } from '../hooks/use-menu'
import type { UsePresenceProps } from '~/components/presence'
import { mergeProps } from '@destyler/solid'
import { createEffect } from 'solid-js'
import {
  PresenceProvider,
  splitPresenceProps,
  usePresence,

} from '~/components/presence'
import { MenuProvider, useMenuContext } from '../hooks/use-menu-context'
import { MenuMachineProvider, useMenuMachineContext } from '../hooks/use-menu-machine-context'
import { MenuTriggerItemProvider } from '../hooks/use-menu-trigger-item-context'

interface RootProviderProps {
  value: UseMenuReturn
}

export interface MenuRootProviderBaseProps extends RootProviderProps, UsePresenceProps {}
export interface MenuRootProviderProps extends MenuRootProviderBaseProps {
  children?: JSX.Element
}

export function MenuRootProvider(props: MenuRootProviderProps) {
  const parentApi = useMenuContext()
  const parentMachine = useMenuMachineContext()
  const [presenceProps, menuProps] = splitPresenceProps(props)
  const menu = () => menuProps.value
  const menuApi: UseMenuReturn['api'] = () => menu().api()
  const menuMachine = () => menu().machine
  const presenceApi = usePresence(
    mergeProps(() => ({ present: menuApi().open }), presenceProps),
  )

  createEffect(() => {
    const machine = parentMachine?.()
    if (!machine)
      return
    parentApi?.().setChild(menuMachine())
    menuApi().setParent(machine)
  })

  const triggerItemContext = () => parentApi?.().getTriggerItemProps(menuApi())

  return (
    <MenuTriggerItemProvider value={triggerItemContext}>
      <MenuMachineProvider value={menuMachine}>
        <MenuProvider value={menuApi}>
          <PresenceProvider value={presenceApi}>{menuProps.children}</PresenceProvider>
        </MenuProvider>
      </MenuMachineProvider>
    </MenuTriggerItemProvider>
  )
}
