import type { Accessor } from '$lib/types.js'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { normalizeProps } from '$lib/utils/normalize-props'
import { resolveQueryRoot } from '$lib/utils/resolve-query-root'
import * as scrollArea from '@destyler/scroll-area'
import { ref } from '@destyler/store'
import { runIfFn } from '@destyler/utils'
import { onMount } from 'svelte'
import { useEnvironmentContext, useLocaleContext } from '../../../providers/index.js'

export interface UseScrollAreaProps extends Omit<scrollArea.Context, 'dir' | 'getRootNode' | 'id'> {
  id: string
  defaultScrollTop?: number
  defaultScrollLeft?: number
}

export interface UseScrollAreaReturn extends Accessor<scrollArea.Api<PropTypes>> {}

export function useScrollArea(props: MaybeFunction<UseScrollAreaProps>): UseScrollAreaReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props)
    const contextProps = { ...resolvedProps }
    delete contextProps.defaultScrollTop
    delete contextProps.defaultScrollLeft
    return {
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ...contextProps,
    }
  })

  const [state, send] = useMachine(() => scrollArea.machine(machineProps as scrollArea.Context), {
    get context() {
      return machineProps as scrollArea.Context
    },
    actions: {
      // @destyler/scroll-area 0.2.6 stores ResizeObserver in proxied context.
      // Marking only this native instance as raw lets the core cleanup action
      // call disconnect() with the correct receiver.
      setupResizeObserver(ctx) {
        const rootNode = ctx.getRootNode?.() ?? env().getRootNode()
        const queryRoot = resolveQueryRoot(rootNode, env().getDocument())
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
        const resizeObserver = ref(new (env().getWindow().ResizeObserver)(updateDimensions))
        resizeObserver.observe(viewport)
        resizeObserver.observe(content)
        ;(ctx as typeof ctx & { _resizeObserver?: ResizeObserver })._resizeObserver = resizeObserver
      },
    },
  })

  const api = $derived(scrollArea.connect(state, send, normalizeProps))

  onMount(() => {
    const resolvedProps = runIfFn(props)
    const top = resolvedProps.defaultScrollTop
    const left = resolvedProps.defaultScrollLeft
    if (top !== undefined || left !== undefined)
      api.scrollTo({ top, left })
  })

  return () => api
}
