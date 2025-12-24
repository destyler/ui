import type { RootProviderProps } from '../types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { AspectRatioProvider } from '../hooks/use-aspect-ratio-context'

export const RootProvider = forwardRef<HTMLDivElement, RootProviderProps>((props, ref) => {
  const { value: aspectRatio, ...localProps } = props
  const mergedProps = mergeProps(aspectRatio.getRootProps(), localProps)

  return (
    <AspectRatioProvider value={aspectRatio}>
      <ui.div ref={ref} {...mergedProps} />
    </AspectRatioProvider>
  )
})

RootProvider.displayName = 'AspectRatioRootProvider'
