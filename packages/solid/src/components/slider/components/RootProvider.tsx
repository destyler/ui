import type { UseSliderReturn } from '../hooks/use-slider'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { SliderProvider } from '../hooks/use-slider-context'

interface RootProviderProps {
  value: UseSliderReturn
}

export interface SliderRootProviderBaseProps extends PolymorphicProps<'div'> {}
export interface SliderRootProviderProps
  extends HTMLProps<'div'>,
  RootProviderProps,
  SliderRootProviderBaseProps {}

export function SliderRootProvider(props: SliderRootProviderProps) {
  const [{ value: slider }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(() => slider().getRootProps(), localProps)

  return (
    <SliderProvider value={slider}>
      <ui.div {...mergedProps} />
    </SliderProvider>
  )
}
