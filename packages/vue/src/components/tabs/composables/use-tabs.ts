import type {PropTypes} from '@destyler/vue';
import type {ComputedRef} from 'vue';
import type { RootEmits } from '../types'
import type { EmitFn, Optional } from '~/types'
import * as tabs from '@destyler/tabs'
import { normalizeProps,  useMachine } from '@destyler/vue'
import { computed,  useId } from 'vue'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseTabsProps extends Optional<Omit<tabs.Context, 'dir' | 'getRootNode' | 'value'>, 'id'> {
  /**
   * The initial value of the tabs when it is first rendered.
   * Use when you do not need to control the state of the tabs.
   */
  defaultValue?: tabs.Context['value']
  modelValue?: tabs.Context['value']
}
export interface UseTabsReturn extends ComputedRef<tabs.Api<PropTypes>> {}

export function useTabs(props: UseTabsProps = {}, emit?: EmitFn<RootEmits>): UseTabsReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)

  const context = computed<tabs.Context>(() => ({
    id,
    dir: locale.value.dir,
    value: props.modelValue ?? props.defaultValue,
    getRootNode: env?.value.getRootNode,
    onFocusChange: details => emit?.('focusChange', details),
    onValueChange: (details) => {
      emit?.('valueChange', details)
      emit?.('update:modelValue', details.value)
    },
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(tabs.machine(context.value), { context })
  return computed(() => tabs.connect(state.value, send, normalizeProps))
}
