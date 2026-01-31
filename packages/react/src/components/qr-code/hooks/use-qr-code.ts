import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as qrcode from '@destyler/qr-code'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseQrCodeProps extends Optional<Omit<qrcode.Context, 'dir' | 'getRootNode'>, 'id'> {
  /**
   * The initial value of the qr code when it is first rendered.
   * Use when you do not need to control the state of the qr code.
   */
  defaultValue?: qrcode.Context['value']
}

export interface UseQrCodeReturn extends qrcode.Api<PropTypes> {}

export function useQrCode(props: UseQrCodeProps = {}): UseQrCodeReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()

  const initialContext: qrcode.Context = {
    id: useId(),
    dir,
    value: props.defaultValue,
    getRootNode,
    onValueChange: useEvent(props.onValueChange, { sync: true }),
    ...props,
  }

  const context: qrcode.Context = {
    ...initialContext,
    value: props.value,
    onValueChange: useEvent(props.onValueChange, { sync: true }),
  }

  const [state, send] = useMachine(qrcode.machine(initialContext), { context })
  return qrcode.connect(state, send, normalizeProps)
}
