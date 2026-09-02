import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as clipboard from '@destyler/clipboard'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext } from '~/providers'

export interface UseClipboardProps
  extends Optional<Omit<clipboard.Context, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseClipboardReturn extends Accessor<clipboard.Api<PropTypes>> {}

export function useClipboard(props: UseClipboardProps = {}): UseClipboardReturn {
  const environment = useEnvironmentContext()
  const id = createUniqueId()

  const context = createMemo(() => ({
    id,
    getRootNode: environment().getRootNode,
    ...props,
  }))
  const [state, send] = useMachine(clipboard.machine(context()), { context })

  return createMemo(() => clipboard.connect(state, send, normalizeProps))
}
