import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as scrollArea from '@destyler/scroll-area'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, onMount } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseScrollAreaProps
  extends Optional<Omit<scrollArea.Context, 'dir' | 'getRootNode'>, 'id'> {
  /** Initial vertical scroll position. */
  defaultScrollTop?: number
  /** Initial horizontal scroll position. */
  defaultScrollLeft?: number
}

export interface UseScrollAreaReturn extends Accessor<scrollArea.Api<PropTypes>> {}

export function useScrollArea(props: UseScrollAreaProps = {}): UseScrollAreaReturn {
  const environment = useEnvironmentContext()
  const locale = useLocaleContext()
  const generatedId = createUniqueId()

  const context = createMemo<scrollArea.Context>(() => ({
    id: props.id ?? generatedId,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    ids: props.ids,
    onScroll: props.onScroll,
    scrollHideDelay: props.scrollHideDelay,
    type: props.type,
    virtual: props.virtual,
  }))

  const [state, send] = useMachine(scrollArea.machine(context()), { context })
  const api = createMemo(() => scrollArea.connect(state, send, normalizeProps))

  onMount(() => {
    const top = props.defaultScrollTop
    const left = props.defaultScrollLeft
    if (top !== undefined || left !== undefined) {
      api().scrollTo({ top, left })
    }
  })

  return api
}
