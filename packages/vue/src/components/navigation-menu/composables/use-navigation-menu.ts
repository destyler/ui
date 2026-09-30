import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../namespace'
import type { RootProps } from '../types'
import type { EmitFn } from '~/types'
import * as navigationMenu from '@destyler/navigation-menu'
import { useMachine } from '@destyler/vue'
import { computed, onMounted, ref, useId } from 'vue'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'
import { connectNavigationMenu } from './connect-navigation-menu'

export interface UseNavigationMenuProps extends RootProps {}

export interface UseNavigationMenuReturn {
  api: ComputedRef<navigationMenu.Api<PropTypes>>
  machine: navigationMenu.Service
}

export function useNavigationMenu(props: UseNavigationMenuProps = {}, emit?: EmitFn<RootEmits>): UseNavigationMenuReturn {
  const mounted = ref(false)
  onMounted(() => {
    mounted.value = true
  })
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)

  const context = computed(() => {
    const { modelValue, defaultValue, ...rest } = props
    return {
      ...cleanProps(rest),
      id: props.id ?? id,
      dir: locale.value.dir,
      // A live null explicitly closes the menu; it must suppress the seed
      // before core derives its initial open/closed state.
      ...(modelValue !== undefined ? { value: modelValue } : { defaultValue }),
      getRootNode: env?.value.getRootNode,
      onValueChange: (details: navigationMenu.ValueChangeDetails) => {
        emit?.('valueChange', details)
        emit?.('update:modelValue', details.value)
      },
    }
  })

  const [state, send, machine] = useMachine(navigationMenu.machine(context.value), { context })
  const api = computed(() => connectNavigationMenu(state.value, send, mounted.value))

  return {
    api,
    machine,
  }
}
