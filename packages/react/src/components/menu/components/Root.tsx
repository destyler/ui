import type { ReactNode } from 'react'
import type { UseMenuProps } from '../hooks/use-menu'
import type { UsePresenceProps } from '~/components/presence'
import { mergeProps } from '@destyler/react'
import { useCallback } from 'react'
import { PresenceProvider, splitPresenceProps, usePresence } from '~/components/presence'
import { useEffectOnce } from '~/hooks/use-effect-once'
import { createSplitProps } from '~/utils/create-split-props'
import { useMenu } from '../hooks/use-menu'
import { MenuProvider, useMenuContext } from '../hooks/use-menu-context'
import { MenuMachineProvider, useMenuMachineContext } from '../hooks/use-menu-machine-context'
import { MenuTriggerItemProvider } from '../hooks/use-menu-trigger-item-context'

export interface MenuRootBaseProps extends UseMenuProps, UsePresenceProps {}
export interface MenuRootProps extends MenuRootBaseProps {
  children?: ReactNode
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
    'navigate',
    'onEscapeKeyDown',
    'onFocusOutside',
    'onHighlightChange',
    'onInteractOutside',
    'onOpenChange',
    'onPointerDownOutside',
    'onSelect',
    'open',
    'positioning',
    'typeahead',
  ])

  const parentApi = useMenuContext()
  const parentMachine = useMenuMachineContext()
  const { api, machine } = useMenu(useMenuProps)
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
          <PresenceProvider value={presence}>
            {localProps.children}
          </PresenceProvider>
        </MenuProvider>
      </MenuMachineProvider>
    </MenuTriggerItemProvider>
  )
}
