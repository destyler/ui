import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import { normalizeProps, useMachine } from '@destyler/solid'
import * as splitter from '@destyler/splitter'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseSplitterProps
  extends Optional<Omit<splitter.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial size of the panels when it is first rendered.
   * Use this when you do not need to control the state of the carousel.
   */
  defaultSize?: splitter.Context['size']
}
export interface UseSplitterReturn extends Accessor<splitter.Api<PropTypes>> {}

export function useSplitter(props: UseSplitterProps = {}): UseSplitterReturn {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const id = createUniqueId()

  const initialContext = createMemo(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    ...props,
    size: props.size ?? props.defaultSize,
  }))
  const context = createMemo(() => ({
    ...initialContext(),
    size: props.size,
  }))
  const [state, send] = useMachine(splitter.machine(initialContext()), { context })

  return createMemo(() => splitter.connect(state, send, normalizeProps))
}
