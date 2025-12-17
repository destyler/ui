import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../namespace'
import type { EmitFn, Optional } from '~/types'
import * as tour from '@destyler/tour'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseTourProps extends Optional<Omit<tour.Context, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseTourReturn extends ComputedRef<tour.Api<PropTypes>> {}

export function useTour(props: UseTourProps = {}, emit?: EmitFn<RootEmits>) {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)

  const context = computed<tour.Context>(() => ({
    id,
    dir: locale.value.dir,
    getRootNode: env?.value.getRootNode,
    onFocusOutside: details => emit?.('focusOutside', details),
    onInteractOutside: details => emit?.('interactOutside', details),
    onPointerDownOutside: details => emit?.('pointerDownOutside', details),
    onStatusChange: details => emit?.('statusChange', details),
    onStepChange: details => emit?.('stepChange', details),
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(tour.machine(context.value), { context })

  return computed(() => tour.connect(state.value, send, normalizeProps))
}
