import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { normalizeProps } from '$lib/utils/normalize-props'
import * as fileUpload from '@destyler/file-upload'
import { runIfFn } from '@destyler/utils'
import { useFieldContext } from '../../field'

export interface UseFileUploadProps extends Omit<fileUpload.Context, 'dir' | 'getRootNode' | 'id'> {
  id: string
}
export interface UseFileUploadReturn extends Accessor<fileUpload.Api<PropTypes>> {}

export function useFileUpload(props: MaybeFunction<UseFileUploadProps>): UseFileUploadReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()
  const field = useFieldContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props)
    return {
      ids: {
        label: field?.().ids?.label,
        hiddenInput: field?.().ids?.control,
      },
      disabled: field?.().disabled,
      required: field?.().required,
      invalid: field?.().invalid,
      dir: locale().dir,
      locale: locale().locale,
      getRootNode: env().getRootNode,
      ...resolvedProps,
    }
  })

  const [state, send] = useMachine(() => fileUpload.machine(machineProps as fileUpload.Context), {
    get context() {
      return machineProps as fileUpload.Context
    },
  })
  const api = $derived(fileUpload.connect(state, send, normalizeProps))
  return () => api
}
