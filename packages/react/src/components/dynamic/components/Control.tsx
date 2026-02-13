import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useDynamicContext } from '../hooks/use-dynamic-context'

export interface DynamicControlBaseProps extends PolymorphicProps {}
export interface DynamicControlProps extends HTMLProps<'div'>, DynamicControlBaseProps {}

export const DynamicControl = forwardRef<HTMLDivElement, DynamicControlProps>((props, ref) => {
  const dynamic = useDynamicContext()
  const mergedProps = mergeProps(dynamic.getControlProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

DynamicControl.displayName = 'DynamicControl'
