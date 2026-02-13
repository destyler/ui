import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as fileUpload from '@destyler/file-upload'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { useFieldContext } from '~/components/field'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseFileUploadProps extends Optional<Omit<fileUpload.Context, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseFileUploadReturn extends fileUpload.Api<PropTypes> {}

export function useFileUpload(props: UseFileUploadProps = {}): UseFileUploadReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()
  const field = useFieldContext()

  const initialContext: fileUpload.Context = {
    id: useId(),
    ids: {
      label: field?.ids.label,
      hiddenInput: field?.ids.control,
    },
    dir,
    disabled: field?.disabled,
    required: field?.required,
    invalid: field?.invalid,
    getRootNode,
    ...props,
  }

  const context: fileUpload.Context = {
    ...initialContext,
    onFileAccept: useEvent(props.onFileAccept),
    onFileReject: useEvent(props.onFileReject),
    onFileChange: useEvent(props.onFileChange, { sync: true }),
  }

  const [state, send] = useMachine(fileUpload.machine(initialContext), { context })
  return fileUpload.connect(state, send, normalizeProps)
}
