import type { ReactNode } from 'react'
import type { UseMenuReturn } from '../hooks/use-menu'
import type { UsePresenceProps } from '~/components/presence'
import { mergeProps } from '@destyler/react'
import { useCallback } from 'react'
import { PresenceProvider, splitPresenceProps, usePresence } from '~/components/presence'
import { useEffectOnce } from '~/hooks/use-effect-once'
import { MenuProvider, useMenuContext } from '../hooks/use-menu-context'
import { MenuMachineProvider, useMenuMachineContext } from '../hooks/use-menu-machine-context'
import { MenuTriggerItemProvider } from '../hooks/use-menu-trigger-item-context'

interface RootProviderProps {
  value: UseMenuReturn
}

export interface MenuRootProviderBaseProps extends RootProviderProps, UsePresenceProps {}
export interface MenuRootProviderProps extends MenuRootProviderBaseProps {
  children?: ReactNode
}

export function MenuRootProvider(props: MenuRootProviderProps) {
  const parentApi = useMenuContext()
  const parentMachine = useMenuMachineContext()
  const [presenceProps, { value: menu, children }] = splitPresenceProps(props)
  const { api, machine } = menu
  const presence = usePresence(mergeProps({ present: api.open }, presenceProps))

  useEffectOnce(() => {
    if (!parentMachine)
      return
    if (!parentApi)
      return

    parentApi.setChild(machine)
    api.setParent(parentMachine)
  })

  const triggerItemContext = useCallback(() => parentApi?.getTriggerItemProps(api), [api, parentApi])

  return (
    <MenuTriggerItemProvider value={triggerItemContext}>
      <MenuMachineProvider value={machine}>
        <MenuProvider value={api}>
          <PresenceProvider value={presence}>{children}</PresenceProvider>
        </MenuProvider>
      </MenuMachineProvider>
    </MenuTriggerItemProvider>
  )
}
