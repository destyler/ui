import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import { normalizeProps, useMachine } from '@destyler/solid'
import * as tabs from '@destyler/tabs'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseTabsProps extends Optional<Omit<tabs.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial value of the tabs when it is first rendered.
   * Use when you do not need to control the state of the tabs.
   */
  defaultValue?: tabs.Context['value']
}
export interface UseTabsReturn extends Accessor<tabs.Api<PropTypes>> {}

export function useTabs(props: UseTabsProps = {}): UseTabsReturn {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const id = createUniqueId()

  const context = createMemo(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    value: props.defaultValue,
    ...props,
  }))

  const [state, send] = useMachine(tabs.machine(context()), { context })
  return createMemo(() => tabs.connect(state, send, normalizeProps))
}
