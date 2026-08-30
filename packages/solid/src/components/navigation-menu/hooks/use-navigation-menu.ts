import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as navigationMenu from '@destyler/navigation-menu'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { isServer } from 'solid-js/web'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

const serverRootNode = {
  getElementById: () => null,
} as unknown as Document

export interface UseNavigationMenuProps
  extends Optional<
    Omit<
      navigationMenu.Context,
      'defaultValue' | 'dir' | 'getRootNode' | 'value.controlled'
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
  const environment = useEnvironmentContext()
  const locale = useLocaleContext()
  const generatedId = createUniqueId()

  const context = createMemo<navigationMenu.Context>(() => {
    const controlled = props.value !== undefined
    return {
      ...props,
      'id': props.id ?? generatedId,
      'dir': locale().dir,
      'getRootNode': isServer ? () => serverRootNode : environment().getRootNode,
      'defaultValue': controlled ? (props.value ?? undefined) : props.defaultValue,
      'value': props.value,
      'value.controlled': controlled,
    } as navigationMenu.Context
  })

  const initialContext = {
    ...context(),
    value: props.value ?? props.defaultValue ?? null,
  }
  const [state, send] = useMachine(navigationMenu.machine(initialContext), { context })

  return createMemo(() => navigationMenu.connect(state, send, normalizeProps))
}
