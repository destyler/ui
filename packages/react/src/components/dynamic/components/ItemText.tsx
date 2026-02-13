import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useDynamicContext } from '../hooks/use-dynamic-context'
import { useDynamicItemPropsContext } from '../hooks/use-dynamic-item-props-context'

export interface DynamicItemTextBaseProps extends PolymorphicProps {}
export interface DynamicItemTextProps extends HTMLProps<'span'>, DynamicItemTextBaseProps {}

export const DynamicItemText = forwardRef<HTMLSpanElement, DynamicItemTextProps>((props, ref) => {
  const dynamic = useDynamicContext()
  const itemProps = useDynamicItemPropsContext()
  const mergedProps = mergeProps(dynamic.getItemTextProps(itemProps), props)

  return <ui.span {...mergedProps} ref={ref} />
})

DynamicItemText.displayName = 'DynamicItemText'
