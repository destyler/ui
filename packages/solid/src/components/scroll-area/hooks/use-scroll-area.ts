import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as scrollArea from '@destyler/scroll-area'
import { normalizeProps, useMachine } from '@destyler/solid'
import { ref } from '@destyler/store'
import { createMemo, createUniqueId, onMount } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'
import { resolveQueryRoot } from '~/utils/resolve-query-root'

export interface UseScrollAreaProps
  extends Optional<Omit<scrollArea.Context, 'dir' | 'getRootNode'>, 'id'> {
  /** Initial vertical scroll position. */
  defaultScrollTop?: number
  /** Initial horizontal scroll position. */
  defaultScrollLeft?: number
}

export interface UseScrollAreaReturn extends Accessor<scrollArea.Api<PropTypes>> {}

type ResizeObserverContext = scrollArea.Context & {
  viewportWidth: number
  viewportHeight: number
  contentWidth: number
  contentHeight: number
  _resizeObserver?: ResizeObserver
}

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

  const setupResizeObserver = (ctx: ResizeObserverContext) => {
    const rootNode = ctx.getRootNode?.() ?? environment().getRootNode()
    const queryRoot = resolveQueryRoot(rootNode, environment().getDocument())
    const viewportId = ctx.ids?.viewport ?? `scroll-area:${ctx.id}:viewport`
    const contentId = ctx.ids?.content ?? `scroll-area:${ctx.id}:content`
    const viewport = queryRoot.getElementById(viewportId)
    const content = queryRoot.getElementById(contentId)
    if (!viewport || !content)
      return

    const updateDimensions = () => {
      ctx.viewportWidth = viewport.clientWidth
      ctx.viewportHeight = viewport.clientHeight
      ctx.contentWidth = content.scrollWidth
      ctx.contentHeight = content.scrollHeight
    }

    updateDimensions()
    const ResizeObserver = environment().getWindow().ResizeObserver
    if (!ResizeObserver)
      return
    const resizeObserver = ref(new ResizeObserver(updateDimensions))
    resizeObserver.observe(viewport)
    resizeObserver.observe(content)
    ctx._resizeObserver = resizeObserver
  }

  const actions = { setupResizeObserver }
  const service = scrollArea.machine(context())
  // The override must be installed before the service starts so the native
  // ResizeObserver is marked as raw before it enters the machine context.
  service.setOptions({ actions })
  const [state, send] = useMachine(service, { actions, context })
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
