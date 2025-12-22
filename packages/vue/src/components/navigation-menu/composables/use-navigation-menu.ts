import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../namespace'
import type { RootProps } from '../types'
import type { EmitFn } from '~/types'
import * as navigationMenu from '@destyler/navigation-menu'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseNavigationMenuProps extends RootProps {}

export interface UseNavigationMenuReturn {
  api: ComputedRef<navigationMenu.Api<PropTypes>>
  machine: navigationMenu.Service
}

export function useNavigationMenu(props: UseNavigationMenuProps = {}, emit?: EmitFn<RootEmits>): UseNavigationMenuReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)

  const context = computed(() => ({
    id,
    dir: locale.value.dir,
    value: props.value ?? props.defaultValue ?? null,
    getRootNode: env?.value.getRootNode,
    onValueChange: (details: navigationMenu.ValueChangeDetails) => {
      emit?.('valueChange', details)
      emit?.('update:value', details.value)
    },
    ...cleanProps(props),
  }))

  const [state, send, machine] = useMachine(navigationMenu.machine(context.value), { context })
  const api = computed(() => navigationMenu.connect(state.value, send, normalizeProps))

  return {
    api,
    machine,
  }
}
