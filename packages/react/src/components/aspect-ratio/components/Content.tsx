import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useAspectRatioContext } from '../hooks/use-aspect-ratio-context'

export interface AspectRatioContentBaseProps extends PolymorphicProps {}
export interface AspectRatioContentProps extends HTMLProps<'div'>, AspectRatioContentBaseProps {}

export const AspectRatioContent = forwardRef<HTMLDivElement, AspectRatioContentProps>((props, ref) => {
  const aspectRatio = useAspectRatioContext()
  const mergedProps = mergeProps(aspectRatio.getContentProps(), props)

  return <ui.div {...mergedProps} ref={ref} />
})

AspectRatioContent.displayName = 'AspectRatioContent'
