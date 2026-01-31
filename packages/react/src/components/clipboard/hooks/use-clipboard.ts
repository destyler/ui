import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as clipboard from '@destyler/clipboard'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { useEnvironmentContext } from '~/providers/environment'

export interface UseClipboardProps extends Optional<Omit<clipboard.Context, 'getRootNode'>, 'id'> {}
export interface UseClipboardReturn extends clipboard.Api<PropTypes> {}

export function useClipboard(props: UseClipboardProps = {}) {
  const { getRootNode } = useEnvironmentContext()

  const initialContext: clipboard.Context = {
    id: useId(),
    getRootNode,
    ...props,
  }

  const context: clipboard.Context = {
    ...initialContext,
  }

  const [state, send] = useMachine(clipboard.machine(initialContext), { context })

  return clipboard.connect(state, send, normalizeProps)
}
