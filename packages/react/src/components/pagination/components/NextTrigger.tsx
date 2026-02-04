import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { usePaginationContext } from '../hooks/use-pagination-context'

export interface PaginationNextTriggerBaseProps extends PolymorphicProps {}
export interface PaginationNextTriggerProps extends HTMLProps<'button'>, PaginationNextTriggerBaseProps {}

export const PaginationNextTrigger = forwardRef<HTMLButtonElement, PaginationNextTriggerProps>((props, ref) => {
  const pagination = usePaginationContext()
  const mergedProps = mergeProps(pagination.getNextTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

PaginationNextTrigger.displayName = 'PaginationNextTrigger'
