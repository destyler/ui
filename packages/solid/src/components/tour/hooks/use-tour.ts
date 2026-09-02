import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import { normalizeProps, useMachine } from '@destyler/solid'
import * as tour from '@destyler/tour'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseTourProps extends Optional<Omit<tour.Context, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseTourReturn extends Accessor<tour.Api<PropTypes>> {}

export function useTour(props: UseTourProps = {}): UseTourReturn {
  const id = createUniqueId()
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()

  const context = createMemo(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    ...props,
  }))

  const [state, send] = useMachine(tour.machine(context()), {
    context,
  })

  return createMemo(() => tour.connect(state, send, normalizeProps))
}
