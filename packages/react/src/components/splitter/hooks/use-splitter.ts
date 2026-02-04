import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import { normalizeProps, useMachine } from '@destyler/react'
import * as splitter from '@destyler/splitter'
import { useId } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseSplitterProps extends Optional<Omit<splitter.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial size of the panels when it is first rendered.
   * Use this when you do not need to control the state of the carousel.
   */
  defaultSize?: splitter.Context['size']
}

export interface UseSplitterReturn extends splitter.Api<PropTypes> {}

export function useSplitter(props: UseSplitterProps = {}): UseSplitterReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()

  const initialContext: splitter.Context = {
    id: useId(),
    dir,
    getRootNode,
    ...props,
    size: props.size ?? props.defaultSize,
  }

  const context: splitter.Context = {
    ...initialContext,
    onSizeChange: useEvent(props.onSizeChange, { sync: true }),
    onSizeChangeEnd: useEvent(props.onSizeChangeEnd),
  }

  const [state, send] = useMachine(splitter.machine(initialContext), { context })

  return splitter.connect(state, send, normalizeProps)
}
