import { mergeProps } from '@destyler/react'
import type { ContentProps } from '../types'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useAspectRatioContext } from '../hooks/use-aspect-ratio-context'

export const Content = forwardRef<HTMLDivElement, ContentProps>((props, ref) => {
  const aspectRatio = useAspectRatioContext()

  const mergedProps = mergeProps(aspectRatio.getContentProps(), props)

  return <ui.div ref={ref} {...mergedProps} />
})

Content.displayName = 'AspectRatioContent'
