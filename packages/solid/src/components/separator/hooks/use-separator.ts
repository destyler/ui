import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as separator from '@destyler/separator'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseSeparatorProps
  extends Optional<Omit<separator.Context, 'dir' | 'getRootNode'>, 'id'> {}

export interface UseSeparatorReturn extends Accessor<separator.Api<PropTypes>> {}

export function useSeparator(props: UseSeparatorProps = {}): UseSeparatorReturn {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const id = createUniqueId()

  const context = createMemo<separator.Context>(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    ...props,
  }))

  const [state, send] = useMachine(separator.machine(context()), { context })

  return createMemo(() => separator.connect(state, send, normalizeProps))
}
