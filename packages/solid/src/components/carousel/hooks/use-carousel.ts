import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as carousel from '@destyler/carousel'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseCarouselProps
  extends Optional<Omit<carousel.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial page of the carousel when it is first rendered.
   * Use this when you do not need to control the state of the carousel.
   */
  defaultPage?: carousel.Context['page']
}
export interface UseCarouselReturn extends Accessor<carousel.Api<PropTypes>> {}

export function useCarousel(props: UseCarouselProps = {}): UseCarouselReturn {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const id = createUniqueId()

  const context = createMemo(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    index: props.defaultPage,
    ...props,
  }))

  const [state, send] = useMachine(carousel.machine(context()), { context })
  return createMemo(() => carousel.connect(state, send, normalizeProps))
}
