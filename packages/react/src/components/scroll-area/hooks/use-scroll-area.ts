import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import { normalizeProps, useMachine } from '@destyler/react'
import * as scrollArea from '@destyler/scroll-area'
import { useId } from 'react'
import { useEffectOnce } from '~/hooks/use-effect-once'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseScrollAreaProps extends Optional<Omit<scrollArea.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial scroll position of the scroll area when it is first rendered.
   * Use when you do not need to control the scroll position.
   */
  defaultScrollTop?: number
  /**
   * The initial scroll left position of the scroll area when it is first rendered.
   * Use when you do not need to control the scroll position.
   */
  defaultScrollLeft?: number
}

export interface UseScrollAreaReturn extends scrollArea.Api<PropTypes> {}

export function useScrollArea(props: UseScrollAreaProps = {}): UseScrollAreaReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()
  const { defaultScrollTop, defaultScrollLeft, ...machineProps } = props

  const initialContext: scrollArea.Context = {
    id: useId(),
    dir,
    getRootNode,
    ...machineProps,
  }

  const context: scrollArea.Context = {
    ...initialContext,
    onScroll: useEvent(props.onScroll),
  }

  const [state, send] = useMachine(scrollArea.machine(initialContext), {
    context,
  })

  const api = scrollArea.connect(state, send, normalizeProps)

  useEffectOnce(() => {
    if (defaultScrollTop !== undefined || defaultScrollLeft !== undefined) {
      api.scrollTo({ top: defaultScrollTop, left: defaultScrollLeft })
    }
  })

  return api
}
