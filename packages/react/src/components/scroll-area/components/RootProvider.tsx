import type { UseScrollAreaReturn } from '../hooks/use-scroll-area'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { ScrollAreaProvider } from '../hooks/use-scroll-area-context'

interface RootProviderProps {
  value: UseScrollAreaReturn
}

export interface ScrollAreaRootProviderBaseProps extends RootProviderProps, PolymorphicProps {}
export interface ScrollAreaRootProviderProps extends Assign<HTMLProps<'div'>, ScrollAreaRootProviderBaseProps> {}

export const ScrollAreaRootProvider = forwardRef<HTMLDivElement, ScrollAreaRootProviderProps>((props, ref) => {
  const [{ value: scrollArea }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(scrollArea.getRootProps(), localProps)

  return (
    <ScrollAreaProvider value={scrollArea}>
      <ui.div {...mergedProps} ref={ref} />
    </ScrollAreaProvider>
  )
})

ScrollAreaRootProvider.displayName = 'ScrollAreaRootProvider'
