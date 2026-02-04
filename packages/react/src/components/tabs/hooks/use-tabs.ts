import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import { normalizeProps, useMachine } from '@destyler/react'
import * as tabs from '@destyler/tabs'
import { useId } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseTabsProps extends Optional<Omit<tabs.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial value of the tabs when it is first rendered.
   * Use when you do not need to control the state of the tabs.
   */
  defaultValue?: tabs.Context['value']
}

export interface UseTabsReturn extends tabs.Api<PropTypes> {}

export function useTabs(props: UseTabsProps = {}): UseTabsReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()

  const initialContext: tabs.Context = {
    id: useId(),
    dir,
    getRootNode,
    value: props.defaultValue,
    ...props,
  }

  const context: tabs.Context = {
    ...initialContext,
    value: props.value,
    onValueChange: useEvent(props.onValueChange, { sync: true }),
    onFocusChange: useEvent(props.onFocusChange),
  }

  const [state, send] = useMachine(tabs.machine(initialContext), { context })
  return tabs.connect(state, send, normalizeProps)
}
