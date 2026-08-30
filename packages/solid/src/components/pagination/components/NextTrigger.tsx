import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { usePaginationContext } from '../hooks/use-pagination-context'

export interface PaginationNextTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface PaginationNextTriggerProps
  extends HTMLProps<'button'>,
  PaginationNextTriggerBaseProps {}

export function PaginationNextTrigger(props: PaginationNextTriggerProps) {
  const api = usePaginationContext()
  const mergedProps = mergeProps(() => api().getNextTriggerProps(), props)

  return <ui.button {...mergedProps} />
}
