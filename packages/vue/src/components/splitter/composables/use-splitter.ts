import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../types'
import type { EmitFn, Optional } from '~/types'
import * as splitter from '@destyler/splitter'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseSplitterProps extends Optional<Omit<splitter.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial size of the panels when it is first rendered.
   * Use this when you do not need to control the state of the carousel.
   */
  defaultSize?: splitter.Context['size']
}

export interface UseSplitterReturn extends ComputedRef<splitter.Api<PropTypes>> {}

export function useSplitter(props: UseSplitterProps = {}, emit?: EmitFn<RootEmits>): UseSplitterReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)

  const context = computed<splitter.Context>(() => ({
    id,
    dir: locale.value.dir,
    size: props.size ?? props.defaultSize,
    getRootNode: env?.value.getRootNode,
    onSizeChange: details => emit?.('sizeChange', details),
    onSizeChangeEnd: details => emit?.('sizeChangeEnd', details),
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(splitter.machine(context.value), { context })
  return computed(() => splitter.connect(state.value, send, normalizeProps))
}
