import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { normalizeProps } from '$lib/utils/normalize-props'
import * as breadcrumbs from '@destyler/breadcrumbs'
import { runIfFn } from '@destyler/utils'

export interface UseBreadcrumbsProps
  extends Omit<breadcrumbs.Context, 'dir' | 'getRootNode' | 'id'> {
  id: string
}

export interface UseBreadcrumbsReturn extends Accessor<breadcrumbs.Api<PropTypes>> {}

export function useBreadcrumbs(
  props: MaybeFunction<UseBreadcrumbsProps>,
): UseBreadcrumbsReturn {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const context = $derived.by(() => ({
    dir: locale().dir,
    getRootNode: env().getRootNode,
    ...runIfFn(props),
  }) as breadcrumbs.Context)

  const [state, send] = useMachine(() => breadcrumbs.machine(context), {
    get context() {
      return context
    },
  })
  const api = $derived(breadcrumbs.connect(state, send, normalizeProps))

  return () => api
}
