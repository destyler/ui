import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { Optional } from '~/types'
import * as breadcrumbs from '@destyler/breadcrumbs'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseBreadcrumbsProps extends Optional<Omit<breadcrumbs.Context, 'dir' | 'getRootNode'>, 'id'> {}

export interface UseBreadcrumbsReturn extends ComputedRef<breadcrumbs.Api<PropTypes>> {}

export function useBreadcrumbs(props: UseBreadcrumbsProps = {}): UseBreadcrumbsReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)
  const id = useId()

  const context = computed<breadcrumbs.Context>(() => ({
    id,
    dir: locale.value.dir,
    getRootNode: env?.value?.getRootNode,
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(breadcrumbs.machine(context.value), { context })

  return computed(() => breadcrumbs.connect(state.value, send, normalizeProps))
}
