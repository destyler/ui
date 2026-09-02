import type { UseAspectRatioReturn } from '../hooks/use-aspect-ratio'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { AspectRatioProvider } from '../hooks/use-aspect-ratio-context'

interface RootProviderProps {
  value: UseAspectRatioReturn
}

export interface AspectRatioRootProviderBaseProps
  extends RootProviderProps,
  PolymorphicProps<'div'> {}
export interface AspectRatioRootProviderProps
  extends HTMLProps<'div'>,
  AspectRatioRootProviderBaseProps {}

export function AspectRatioRootProvider(props: AspectRatioRootProviderProps) {
  const [providerProps, localProps] = createSplitProps<RootProviderProps>()(props, [
    'value',
  ])
  const aspectRatio = () => providerProps.value()
  const mergedProps = mergeProps(() => aspectRatio().getRootProps(), localProps)

  return (
    <AspectRatioProvider value={aspectRatio}>
      <ui.div {...mergedProps} />
    </AspectRatioProvider>
  )
}
