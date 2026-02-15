import type { UseScrollAreaProps } from '../hooks/use-scroll-area'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useScrollArea } from '../hooks/use-scroll-area'
import { ScrollAreaProvider } from '../hooks/use-scroll-area-context'

export interface ScrollAreaRootBaseProps extends UseScrollAreaProps, PolymorphicProps {}
export interface ScrollAreaRootProps extends Assign<HTMLProps<'div'>, ScrollAreaRootBaseProps> {}

export const ScrollAreaRoot = forwardRef<HTMLDivElement, ScrollAreaRootProps>((props, ref) => {
  const [useScrollAreaProps, localProps] = createSplitProps<UseScrollAreaProps>()(props, [
    'id',
    'ids',
    'scrollHideDelay',
    'type',
    'dir',
    'virtual',
    'getRootNode',
    'onScroll',
  ])
  const scrollArea = useScrollArea(useScrollAreaProps)
  const mergedProps = mergeProps(scrollArea.getRootProps(), localProps)

  return (
    <ScrollAreaProvider value={scrollArea}>
      <ui.div {...mergedProps} ref={ref} />
    </ScrollAreaProvider>
  )
})

ScrollAreaRoot.displayName = 'ScrollAreaRoot'
