import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as navigationMenu from '@destyler/navigation-menu'
import { useMachine } from '@destyler/solid'
import { createMemo, createSignal, createUniqueId, onMount } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'
import { resolveMachineProps } from '~/utils/resolve-machine-props'

import { connectNavigationMenu } from './connect-navigation-menu'

export interface UseNavigationMenuProps
  extends Optional<
    Omit<
      navigationMenu.Context,
      'dir' | 'getRootNode'
    >,
    'id'
  > {
  /**
   * The initial value of the navigation menu when it is first rendered.
   * Use when you do not need to control its state.
   */
  defaultValue?: string
}

export interface UseNavigationMenuReturn
  extends Accessor<navigationMenu.Api<PropTypes>> {}

export function useNavigationMenu(props: UseNavigationMenuProps = {}): UseNavigationMenuReturn {
  const [mounted, setMounted] = createSignal(false)
  onMount(() => setMounted(true))
  const environment = useEnvironmentContext()
  const locale = useLocaleContext()
  const generatedId = createUniqueId()

  const context = createMemo<navigationMenu.Context>(() => {
    return {
      // A live null explicitly closes the menu. Remove the default before core
      // derives its initial state tag, not only when applying its context.
      ...resolveMachineProps(props, props.value !== undefined ? ['defaultValue'] : []),
      id: props.id ?? generatedId,
      dir: locale().dir,
      getRootNode: environment().getRootNode,
    } as navigationMenu.Context
  })

  const initialContext = {
    ...context(),
  }
  const [state, send] = useMachine(navigationMenu.machine(initialContext), { context })

  return createMemo(() => connectNavigationMenu(state, send, mounted()))
}
