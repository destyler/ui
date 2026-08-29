import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import * as qrcode from '@destyler/qr-code'
import { normalizeProps } from '@destyler/svelte'
import { runIfFn } from '@destyler/utils'

export interface UseQrCodeProps extends Omit<qrcode.Context, 'dir' | 'getRootNode' | 'id'> {
  id: string
  defaultValue?: qrcode.Context['value']
}
export interface UseQrCodeReturn extends Accessor<qrcode.Api<PropTypes>> {}

export function useQrCode(props: MaybeFunction<UseQrCodeProps>) {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props)
    return createMachineProps({
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ...resolvedProps,
    }, { value: 'defaultValue' })
  })

  const [state, send] = useMachine(() => qrcode.machine(machineProps.initial as qrcode.Context), {
    get context() {
      return machineProps.context as qrcode.Context
    },
  })
  const api = $derived(qrcode.connect(state, send, normalizeProps))

  return () => api
}
