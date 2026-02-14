import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as breadcrumbs from '@destyler/breadcrumbs'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseBreadcrumbsProps extends Optional<Omit<breadcrumbs.Context, 'dir' | 'getRootNode'>, 'id'> {}

export interface UseBreadcrumbsReturn extends breadcrumbs.Api<PropTypes> {}

export function useBreadcrumbs(props: UseBreadcrumbsProps = {}): UseBreadcrumbsReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()
  const id = useId()

  const context: breadcrumbs.Context = {
    id,
    dir,
    getRootNode,
    ...props,
  }

  const [state, send] = useMachine(breadcrumbs.machine(context), { context })
  return breadcrumbs.connect(state, send, normalizeProps)
}
