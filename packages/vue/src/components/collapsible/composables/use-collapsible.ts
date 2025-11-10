import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../types'
import type { RenderStrategyProps } from '~/composables/use-render-strategy'
import type { EmitFn, Optional } from '~/types'
import * as collapsible from '@destyler/collapsible'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, ref, useId, watch } from 'vue'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseCollapsibleProps
  extends RenderStrategyProps,
  Optional<Omit<collapsible.Context, 'dir' | 'getRootNode' | 'open.controlled'>, 'id'> {
  /**
   * The initial open state of the collapsible when it is first rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: collapsible.Context['open']
  /**
   * The controlled open state of the collapsible. Can be binded with v-model.
   */
  open?: collapsible.Context['open']
}

interface Collapsible extends collapsible.Api<PropTypes> {
  /**
   * Whether the content is unmounted
   */
  unmounted?: boolean
}

export interface UseCollapsibleReturn extends ComputedRef<Collapsible> {}

export function useCollapsible(props: UseCollapsibleProps = {}, emits?: EmitFn<RootEmits>): UseCollapsibleReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)

  const context = computed<collapsible.Context>(() => ({
    id,
    'dir': locale.value.dir,
    'open': props.defaultOpen,
    'open.controlled': props.open !== undefined,
    'getRootNode': env?.value.getRootNode,
    'onExitComplete': () => emits?.('exitComplete'),
    'onOpenChange': (details) => {
      emits?.('openChange', details)
      emits?.('update:open', details.open)
    },
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(collapsible.machine(context.value), { context })
  const api = computed(() => collapsible.connect(state.value, send, normalizeProps))

  const wasVisible = ref(false)
  watch(
    () => api.value.visible,
    () => {
      if (api.value.visible) {
        wasVisible.value = true
      }
    },
  )

  return computed(() => ({
    ...api.value,
    unmounted:
      (!api.value.visible && !wasVisible.value && props.lazyMount)
      || (props.unmountOnExit && !api.value.visible && wasVisible.value),
  }))
}
