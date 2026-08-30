import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as signature from '@destyler/signature'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useFieldContext } from '~/components/field'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseSignatureProps
  extends Optional<Omit<signature.Context, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseSignatureReturn extends Accessor<signature.Api<PropTypes>> {}

export function useSignature(props: UseSignatureProps = {}): UseSignatureReturn {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const id = createUniqueId()
  const field = useFieldContext()

  const context = createMemo<signature.Context>(() => ({
    id,
    ids: {
      label: field?.().ids.label,
      hiddenInput: field?.().ids.control,
    },
    disabled: field?.().disabled,
    readOnly: field?.().readOnly,
    required: field?.().required,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    ...props,
  }))

  const [state, send] = useMachine(signature.machine(context()), { context })

  return createMemo(() => signature.connect(state, send, normalizeProps))
}
