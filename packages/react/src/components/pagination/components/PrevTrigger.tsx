import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { usePaginationContext } from '../hooks/use-pagination-context'

export interface PaginationPrevTriggerBaseProps extends PolymorphicProps {}
export interface PaginationPrevTriggerProps extends HTMLProps<'button'>, PaginationPrevTriggerBaseProps {}

export const PaginationPrevTrigger = forwardRef<HTMLButtonElement, PaginationPrevTriggerProps>((props, ref) => {
  const pagination = usePaginationContext()
  const mergedProps = mergeProps(pagination.getPrevTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

PaginationPrevTrigger.displayName = 'PaginationPrevTrigger'
