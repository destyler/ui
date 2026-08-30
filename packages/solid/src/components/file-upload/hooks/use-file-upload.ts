import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as fileUpload from '@destyler/file-upload'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useFieldContext } from '~/components/field'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseFileUploadProps
  extends Optional<Omit<fileUpload.Context, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseFileUploadReturn extends Accessor<fileUpload.Api<PropTypes>> {}

export function useFileUpload(props: UseFileUploadProps = {}): UseFileUploadReturn {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const id = createUniqueId()
  const field = useFieldContext()

  const context = createMemo(() => ({
    id,
    ids: {
      label: field?.().ids.label,
      hiddenInput: field?.().ids.control,
    },
    dir: locale().dir,
    disabled: field?.().disabled,
    required: field?.().required,
    invalid: field?.().invalid,
    getRootNode: environment().getRootNode,
    ...props,
  }))

  const [state, send] = useMachine(fileUpload.machine(context()), { context })

  return createMemo(() => fileUpload.connect(state, send, normalizeProps))
}
