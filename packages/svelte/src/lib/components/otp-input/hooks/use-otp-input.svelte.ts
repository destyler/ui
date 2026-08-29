import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import { normalizeProps } from '$lib/utils/normalize-props'
import * as otpInput from '@destyler/otp-input'
import { runIfFn } from '@destyler/utils'
import { useFieldContext } from '../../field'

export interface UseOtpInputProps extends Omit<otpInput.Context, 'dir' | 'getRootNode' | 'id'> {
  id: string
  defaultValue?: otpInput.Context['value']
}
export interface UseOtpInputReturn extends Accessor<otpInput.Api<PropTypes>> {}

export function useOtpInput(props: MaybeFunction<UseOtpInputProps>): UseOtpInputReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()
  const field = useFieldContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props)
    return createMachineProps({
      ids: {
        label: field?.().ids?.label,
        hiddenInput: field?.().ids?.control,
      },
      disabled: field?.().disabled,
      readOnly: field?.().readOnly,
      required: field?.().required,
      invalid: field?.().invalid,
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ...resolvedProps,
    }, { value: 'defaultValue' })
  })

  const [state, send] = useMachine(() => otpInput.machine(machineProps.initial as otpInput.Context), {
    get context() {
      return machineProps.context as otpInput.Context
    },
  })
  const api = $derived(otpInput.connect(state, send, normalizeProps))
  return () => api
}
