import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../types'
import type { EmitFn, Optional } from '~/types'
import * as scrollArea from '@destyler/scroll-area'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseScrollAreaProps extends Optional<Omit<scrollArea.Context, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseScrollAreaReturn extends ComputedRef<scrollArea.Api<PropTypes>> {}

export function useScrollArea(props: UseScrollAreaProps = {}, emit?: EmitFn<RootEmits>): UseScrollAreaReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)

  const context = computed(() => ({
    id,
    dir: locale.value.dir,
    getRootNode: env?.value.getRootNode,
    onScroll: details => emit?.('scroll', details),
    ...cleanProps(props),
  }) as scrollArea.Context)

  const [state, send] = useMachine(scrollArea.machine(context.value), { context: context as any })
  return computed(() => scrollArea.connect(state.value, send, normalizeProps))
}
