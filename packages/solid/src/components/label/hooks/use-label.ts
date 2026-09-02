import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as label from '@destyler/label'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseLabelProps
  extends Optional<Omit<label.Context, 'dir' | 'getRootNode'>, 'id'> {}

export interface UseLabelReturn extends Accessor<label.Api<PropTypes>> {}

export function useLabel(props: UseLabelProps = {}): UseLabelReturn {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const id = createUniqueId()

  const context = createMemo<label.Context>(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    ...props,
  }))

  const [state, send] = useMachine(label.machine(context()), { context })

  return createMemo(() => label.connect(state, send, normalizeProps))
}
