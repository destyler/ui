import type { UseSliderReturn } from '../hooks/use-slider'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { SliderProvider } from '../hooks/use-slider-context'

interface RootProviderProps {
  value: UseSliderReturn
}

export interface SliderRootProviderBaseProps extends RootProviderProps, PolymorphicProps {}
export interface SliderRootProviderProps extends HTMLProps<'div'>, SliderRootProviderBaseProps {}

export const SliderRootProvider = forwardRef<HTMLDivElement, SliderRootProviderProps>((props, ref) => {
  const [{ value: slider }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(slider.getRootProps(), localProps)

  return (
    <SliderProvider value={slider}>
      <ui.div {...mergedProps} ref={ref} />
    </SliderProvider>
  )
})

SliderRootProvider.displayName = 'SliderRootProvider'
