import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useDynamicContext } from '../hooks/use-dynamic-context'

export interface DynamicClearTriggerBaseProps extends PolymorphicProps {}
export interface DynamicClearTriggerProps extends HTMLProps<'button'>, DynamicClearTriggerBaseProps {}

export const DynamicClearTrigger = forwardRef<HTMLButtonElement, DynamicClearTriggerProps>((props, ref) => {
  const dynamic = useDynamicContext()
  const mergedProps = mergeProps(dynamic.getClearTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

DynamicClearTrigger.displayName = 'DynamicClearTrigger'
