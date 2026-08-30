import type { UseScrollAreaReturn } from '../hooks/use-scroll-area'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { ScrollAreaProvider } from '../hooks/use-scroll-area-context'

interface RootProviderProps {
  value: UseScrollAreaReturn
}

export interface ScrollAreaRootProviderBaseProps
  extends RootProviderProps,
  PolymorphicProps<'div'> {}
export interface ScrollAreaRootProviderProps
  extends Assign<HTMLProps<'div'>, ScrollAreaRootProviderBaseProps> {}

export function ScrollAreaRootProvider(props: ScrollAreaRootProviderProps) {
  const [providerProps, localProps] = createSplitProps<RootProviderProps>()(props, [
    'value',
  ])
  const scrollArea: UseScrollAreaReturn = () => providerProps.value()
  const mergedProps = mergeProps(
    () => scrollArea().getRootProps(),
    localProps,
  )

  return (
    <ScrollAreaProvider value={scrollArea}>
      <ui.div {...mergedProps} />
    </ScrollAreaProvider>
  )
}
