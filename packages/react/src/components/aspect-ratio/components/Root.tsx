import type { UseAspectRatioProps } from '../hooks/use-aspect-ratio'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { splitAspectRatioProps } from '../hooks/split-aspect-ratio-props'
import { useAspectRatio } from '../hooks/use-aspect-ratio'
import { AspectRatioProvider } from '../hooks/use-aspect-ratio-context'

export interface AspectRatioRootBaseProps extends UseAspectRatioProps, PolymorphicProps {}
export interface AspectRatioRootProps extends HTMLProps<'div'>, AspectRatioRootBaseProps {}

export const AspectRatioRoot = forwardRef<HTMLDivElement, AspectRatioRootProps>((props, ref) => {
  const [useAspectRatioProps, localProps] = splitAspectRatioProps(props)
  const aspectRatio = useAspectRatio(useAspectRatioProps)
  const mergedProps = mergeProps(aspectRatio.getRootProps(), localProps)

  return (
    <AspectRatioProvider value={aspectRatio}>
      <ui.div {...mergedProps} ref={ref} />
    </AspectRatioProvider>
  )
})

AspectRatioRoot.displayName = 'AspectRatioRoot'
