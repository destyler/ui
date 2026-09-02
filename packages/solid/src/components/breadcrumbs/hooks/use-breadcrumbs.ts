import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as breadcrumbs from '@destyler/breadcrumbs'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseBreadcrumbsProps
  extends Optional<Omit<breadcrumbs.Context, 'dir' | 'getRootNode'>, 'id'> {}

export interface UseBreadcrumbsReturn extends Accessor<breadcrumbs.Api<PropTypes>> {}

export function useBreadcrumbs(props: UseBreadcrumbsProps): UseBreadcrumbsReturn {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const id = createUniqueId()

  const context = createMemo<breadcrumbs.Context>(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    ...props,
  }))

  const [state, send] = useMachine(breadcrumbs.machine(context()), { context })

  return createMemo(() => breadcrumbs.connect(state, send, normalizeProps))
}
