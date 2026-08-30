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
  const presenceApi = usePresence(
    mergeProps(presenceProps, () => ({ present: menuProps.value.api().open })),
  )

  createEffect(() => {
    if (!parentMachine)
      return
    parentApi?.().setChild(menuProps.value.machine)
    menuProps.value.api().setParent(parentMachine)
  })

  const triggerItemContext = () => parentApi?.().getTriggerItemProps(menuProps.value.api())

  return (
    <MenuTriggerItemProvider value={triggerItemContext}>
      <MenuMachineProvider value={menuProps.value.machine}>
        <MenuProvider value={menuProps.value.api}>
          <PresenceProvider value={presenceApi}>{menuProps.children}</PresenceProvider>
        </MenuProvider>
      </MenuMachineProvider>
    </MenuTriggerItemProvider>
  )
}
