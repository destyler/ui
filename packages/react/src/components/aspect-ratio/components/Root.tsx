import type { RootProps, UseAspectRatioProps } from '../types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useAspectRatio } from '../hooks/use-aspect-ratio'
import { AspectRatioProvider } from '../hooks/use-aspect-ratio-context'

export const Root = forwardRef<HTMLDivElement, RootProps>((props, ref) => {
  const [useAspectRatioProps, localProps] = createSplitProps<UseAspectRatioProps>()(props, [
    'dir',
    'id',
    'ids',
    'ratio',
  ])
  const aspectRatio = useAspectRatio(useAspectRatioProps)
  const mergedProps = mergeProps(aspectRatio.getRootProps(), localProps)

  return (
    <AspectRatioProvider value={aspectRatio}>
      <ui.div ref={ref} {...mergedProps} />
    </AspectRatioProvider>
  )
})

Root.displayName = 'AspectRatioRoot'
