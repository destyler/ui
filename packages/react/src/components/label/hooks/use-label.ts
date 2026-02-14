import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as label from '@destyler/label'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseLabelProps extends Optional<Omit<label.Context, 'dir' | 'getRootNode'>, 'id'> {}

export interface UseLabelReturn extends label.Api<PropTypes> {}

export function useLabel(props: UseLabelProps = {}): UseLabelReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()

  const initialContext: label.Context = {
    id: useId(),
    dir,
    getRootNode,
    ...props,
  }

  const [state, send] = useMachine(label.machine(initialContext), {
    context: initialContext,
  })

  return label.connect(state, send, normalizeProps)
}
