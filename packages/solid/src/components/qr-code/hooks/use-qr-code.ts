import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as qrCode from '@destyler/qr-code'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseQrCodeProps
  extends Optional<Omit<qrCode.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial value of the qr code when it is first rendered.
   * Use when you do not need to control the state of the qr code.
   */
  defaultValue?: qrCode.Context['value']
}

export interface UseQrCodeReturn extends Accessor<qrCode.Api<PropTypes>> {}

export function useQrCode(props: UseQrCodeProps = {}): UseQrCodeReturn {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const id = createUniqueId()

  const initialContext = createMemo(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    value: props.defaultValue,
    ...props,
  }))

  const context = createMemo(() => ({
    ...initialContext(),
    value: props.value,
  }))

  const [state, send] = useMachine(qrCode.machine(initialContext()), {
    context,
  })
  return createMemo(() => qrCode.connect(state, send, normalizeProps))
}
