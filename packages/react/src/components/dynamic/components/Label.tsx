import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useDynamicContext } from '../hooks/use-dynamic-context'

export interface DynamicLabelBaseProps extends PolymorphicProps {}
export interface DynamicLabelProps extends HTMLProps<'label'>, DynamicLabelBaseProps {}

export const DynamicLabel = forwardRef<HTMLLabelElement, DynamicLabelProps>((props, ref) => {
  const dynamic = useDynamicContext()
  const mergedProps = mergeProps(dynamic.getLabelProps(), props)

  return <ui.label {...mergedProps} ref={ref} />
})

DynamicLabel.displayName = 'DynamicLabel'
