import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../types'
import type { EmitFn, Optional } from '~/types'
import * as floatingPanel from '@destyler/floating-panel'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseFloatingPanelProps
  extends Optional<Omit<floatingPanel.Context, 'dir' | 'getRootNode' | 'open.controlled'>, 'id'> {
  /**
   * The initial open state of the floating panel when it is first rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: floatingPanel.Context['open']
}

export interface UseFloatingPanelReturn extends ComputedRef<floatingPanel.Api<PropTypes>> {}

export function useFloatingPanel(props: UseFloatingPanelProps = {}, emit?: EmitFn<RootEmits>): UseFloatingPanelReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)

  const context = computed<floatingPanel.Context>(() => ({
    id,
    dir: locale.value.dir,
    open: props.open ?? props.defaultOpen,
    getRootNode: env?.value.getRootNode,
    onOpenChange: (details) => {
      emit?.('openChange', details)
      emit?.('update:open', details.open)
    },
    onSizeChange: details => emit?.('sizeChange', details),
    onSizeChangeEnd: details => emit?.('sizeChangeEnd', details),
    onPositionChange: details => emit?.('positionChange', details),
    onPositionChangeEnd: details => emit?.('positionChangeEnd', details),
    onStageChange: details => emit?.('stageChange', details),
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(floatingPanel.machine(context.value), { context })

  return computed(() => floatingPanel.connect(state.value, send, normalizeProps))
}
