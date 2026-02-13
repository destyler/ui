import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import { normalizeProps, useMachine } from '@destyler/react'
import * as signature from '@destyler/signature'
import { useId } from 'react'
import { useFieldContext } from '~/components/field'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseSignatureProps extends Optional<Omit<signature.Context, 'dir' | 'getRootNode'>, 'id'> {}

export interface UseSignatureReturn extends signature.Api<PropTypes> {}

export function useSignature(props: UseSignatureProps = {}): UseSignatureReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()
  const field = useFieldContext()

  const initialContext: signature.Context = {
    id: useId(),
    ids: {
      label: field?.ids.label,
      hiddenInput: field?.ids.control,
    },
    dir,
    disabled: field?.disabled,
    readOnly: field?.readOnly,
    required: field?.required,
    getRootNode,
    ...props,
  }

  const context: signature.Context = {
    ...initialContext,
    drawing: props.drawing,
    onDraw: useEvent(props.onDraw),
    onDrawEnd: useEvent(props.onDrawEnd),
  }

  const [state, send] = useMachine(signature.machine(initialContext), { context })

  return signature.connect(state, send, normalizeProps)
}
