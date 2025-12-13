import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../types'
import type { EmitFn, Optional } from '~/types'
import * as qrCode from '@destyler/qr-code'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseQrCodeProps extends Optional<Omit<qrCode.Context, 'dir' | 'getRootNode' | 'value'>, 'id'> {
  /**
   * The initial value of the qr code when it is first rendered.
   * Use when you do not need to control the state of the qr code.
   */
  defaultValue?: qrCode.Context['value']
  /**
   * Use this prop to control the value of the qr code.
   */
  modelValue?: qrCode.Context['value']
}

export interface UseQrCodeReturn extends ComputedRef<qrCode.Api<PropTypes>> {}

export function useQrCode(props: UseQrCodeProps = {}, emit?: EmitFn<RootEmits>): UseQrCodeReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)

  const context = computed<qrCode.Context>(() => ({
    id,
    dir: locale.value.dir,
    value: props.modelValue ?? props.defaultValue,
    getRootNode: env?.value.getRootNode,
    onValueChange: (details) => {
      emit?.('valueChange', details)
      emit?.('update:modelValue', details.value)
    },
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(qrCode.machine(context.value), { context })
  return computed(() => qrCode.connect(state.value, send, normalizeProps))
}
