import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useDynamicContext } from '../hooks/use-dynamic-context'
import { useDynamicItemPropsContext } from '../hooks/use-dynamic-item-props-context'

export interface DynamicItemPreviewBaseProps extends PolymorphicProps {}
export interface DynamicItemPreviewProps extends HTMLProps<'div'>, DynamicItemPreviewBaseProps {}

export const DynamicItemPreview = forwardRef<HTMLDivElement, DynamicItemPreviewProps>((props, ref) => {
  const dynamic = useDynamicContext()
  const itemProps = useDynamicItemPropsContext()
  const mergedProps = mergeProps(dynamic.getItemPreviewProps(itemProps), props)

  return <ui.div {...mergedProps} ref={ref} />
})

DynamicItemPreview.displayName = 'DynamicItemPreview'
