import type { UseAspectRatioReturn } from '../hooks/use-aspect-ratio'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { AspectRatioProvider } from '../hooks/use-aspect-ratio-context'

interface RootProviderProps {
  value: UseAspectRatioReturn
}

export interface AspectRatioRootProviderBaseProps extends RootProviderProps, PolymorphicProps {}
export interface AspectRatioRootProviderProps extends HTMLProps<'div'>, AspectRatioRootProviderBaseProps {}

export const AspectRatioRootProvider = forwardRef<HTMLDivElement, AspectRatioRootProviderProps>((props, ref) => {
  const [{ value: aspectRatio }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(aspectRatio.getRootProps(), localProps)

  return (
    <AspectRatioProvider value={aspectRatio}>
      <ui.div {...mergedProps} ref={ref} />
    </AspectRatioProvider>
  )
})

AspectRatioRootProvider.displayName = 'AspectRatioRootProvider'
