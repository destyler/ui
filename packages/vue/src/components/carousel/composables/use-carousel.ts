import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../types'
import type { EmitFn, Optional } from '~/types'
import * as carousel from '@destyler/carousel'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseCarouselProps extends Optional<Omit<carousel.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial page of the carousel when it is first rendered.
   * Use this when you do not need to control the state of the carousel.
   */
  defaultPage?: carousel.Context['page']
}
export interface UseCarouselReturn extends ComputedRef<carousel.Api<PropTypes>> {}

export function useCarousel(props: UseCarouselProps = {}, emit?: EmitFn<RootEmits>): UseCarouselReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)
  const context = computed<carousel.Context>(() => ({
    id,
    dir: locale.value.dir,
    index: props.defaultPage,
    getRootNode: env?.value.getRootNode,
    onAutoplayStatusChange: details => emit?.('autoplayStatusChange', details),
    onDragStatusChange: details => emit?.('dragStatusChange', details),
    onPageChange: (details) => {
      emit?.('pageChange', details)
      emit?.('update:page', details.page)
    },
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(carousel.machine(context.value), { context })
  return computed(() => carousel.connect(state.value, send, normalizeProps))
}
