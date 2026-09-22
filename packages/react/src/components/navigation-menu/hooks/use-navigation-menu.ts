import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as navigationMenu from '@destyler/navigation-menu'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

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
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()

  const { onValueChange, ...contextProps } = props

  const initialContext: navigationMenu.Context = {
    id: useId(),
    dir,
    getRootNode,
    ...contextProps,
  }

  const context: navigationMenu.Context = {
    ...initialContext,
    onValueChange: useEvent(onValueChange, { sync: true }),
  }

  const [state, send] = useMachine(navigationMenu.machine(initialContext), {
    context,
  })
  return navigationMenu.connect(state, send, normalizeProps)
}
