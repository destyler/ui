import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as navigationMenu from '@destyler/navigation-menu'
import { useEffect, useId, useState } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useMachine } from '~/hooks/use-machine'
import { useEnvironmentContext, useLocaleContext } from '~/providers'
import { normalizeMachineProps } from '~/utils/normalize-machine-props'
import { connectNavigationMenu } from './connect-navigation-menu'

export interface UseNavigationMenuProps
  extends Optional<Omit<navigationMenu.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial value of the navigation menu when it is first rendered.
   * Use when you do not need to control its state.
   */
  defaultValue?: string
}

export interface UseNavigationMenuReturn extends navigationMenu.Api<PropTypes> {}

export function useNavigationMenu(props: UseNavigationMenuProps = {}): UseNavigationMenuReturn {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()

  const { onValueChange, ...contextProps } = props

  const initialContext: navigationMenu.Context = {
    id: useId(),
    dir,
    getRootNode,
    ...normalizeMachineProps(contextProps),
    // null is an explicit closed value. Suppress the default seed before core
    // chooses its initial state tag, not only when setting the live context.
    ...(contextProps.value !== undefined ? { defaultValue: undefined } : {}),
  }

  const context: navigationMenu.Context = {
    ...initialContext,
    onValueChange: useEvent(onValueChange, { sync: true }),
  }

  const [state, send] = useMachine(navigationMenu.machine(initialContext), {
    context,
  })
  return connectNavigationMenu(state, send, mounted)
}
