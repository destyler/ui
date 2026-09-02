import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { usePaginationContext } from '../hooks/use-pagination-context'

export interface PaginationPrevTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface PaginationPrevTriggerProps
  extends HTMLProps<'button'>,
  PaginationPrevTriggerBaseProps {}

export function PaginationPrevTrigger(props: PaginationPrevTriggerProps) {
  const api = usePaginationContext()
  const mergedProps = mergeProps(() => {
    return {
      disabled: undefined,
      type: undefined,
      ...api().getPrevTriggerProps(),
    }
  }, props)

  return <ui.button {...mergedProps} />
}
