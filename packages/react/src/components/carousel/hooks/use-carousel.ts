import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as carousel from '@destyler/carousel'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseCarouselProps extends Optional<Omit<carousel.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial page of the carousel when it is first rendered.
   * Use this when you do not need to control the state of the carousel.
   */
  defaultPage?: carousel.Context['page']
}

export interface UseCarouselReturn extends carousel.Api<PropTypes> {}

export function useCarousel(props: UseCarouselProps = {}): UseCarouselReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()

  const initialContext: carousel.Context = {
    id: useId(),
    dir,
    getRootNode,
    page: props.defaultPage,
    ...props,
  }

  const context: carousel.Context = {
    ...initialContext,
    page: props.page,
    onPageChange: useEvent(props.onPageChange, { sync: true }),
  }

  const [state, send] = useMachine(carousel.machine(initialContext), { context })
  return carousel.connect(state, send, normalizeProps)
}
