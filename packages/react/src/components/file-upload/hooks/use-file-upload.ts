import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import { getDocument } from '@destyler/dom'
import * as fileUpload from '@destyler/file-upload'
import { normalizeProps, useMachine } from '@destyler/react'
import { useCallback, useId } from 'react'
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
  // URL resources belong to their window, not to a changing machine snapshot.
  // Resolve the current environment rather than retaining a connect closure over
  // an older snapshot. Do not access the default document during server rendering.
  const ownerWindow = typeof window === 'undefined'
    ? undefined
    : getDocument(context.getRootNode?.() ?? document).defaultView ?? window
  // Public API calls must also resolve mutable root getters at call time.
  const resolveOwnerWindow = useEvent(() => getDocument(context.getRootNode?.() ?? document).defaultView ?? window)
  const createFileUrl = useCallback<UseFileUploadReturn['createFileUrl']>((file, cb) => {
    const win = resolveOwnerWindow() ?? ownerWindow ?? window
    const url = win.URL.createObjectURL(file)
    cb(url)
    return () => win.URL.revokeObjectURL(url)
  }, [ownerWindow, resolveOwnerWindow])

  return { ...fileUpload.connect(state, send, normalizeProps), createFileUrl }
}
