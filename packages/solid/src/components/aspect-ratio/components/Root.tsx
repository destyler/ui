import type { UseAspectRatioProps } from '../hooks/use-aspect-ratio'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useAspectRatio } from '../hooks/use-aspect-ratio'
import { AspectRatioProvider } from '../hooks/use-aspect-ratio-context'

export interface AspectRatioRootBaseProps
  extends UseAspectRatioProps,
  PolymorphicProps<'div'> {}
export interface AspectRatioRootProps extends HTMLProps<'div'>, AspectRatioRootBaseProps {}

export function AspectRatioRoot(props: AspectRatioRootProps) {
  const [useAspectRatioProps, localProps] = createSplitProps<UseAspectRatioProps>()(props, [
    'defaultRatio',
    'id',
    'ids',
    'ratio',
  ])
  const aspectRatio = useAspectRatio(useAspectRatioProps)
  const mergedProps = mergeProps(() => aspectRatio().getRootProps(), localProps)

  return (
    <AspectRatioProvider value={aspectRatio}>
      <ui.div {...mergedProps} />
    </AspectRatioProvider>
  )
}
