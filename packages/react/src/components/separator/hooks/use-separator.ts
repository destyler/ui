import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import { normalizeProps, useMachine } from '@destyler/react'
import * as separator from '@destyler/separator'
import { useId } from 'react'
import { useEnvironmentContext } from '~/providers'

export interface UseSeparatorProps
  extends Optional<Omit<separator.Context, 'getRootNode'>, 'id'> {}

export interface UseSeparatorReturn extends separator.Api<PropTypes> {}

export function useSeparator(props: UseSeparatorProps = {}): UseSeparatorReturn {
  const { getRootNode } = useEnvironmentContext()
  const id = useId()

  const context: separator.Context = {
    id,
    getRootNode,
    ...props,
  }

  const [state, send] = useMachine(separator.machine(context), { context })
  const api = separator.connect(state, send, normalizeProps)

  return api
}
