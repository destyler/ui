import type { UseScrollAreaProps } from '../hooks/use-scroll-area'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useScrollArea } from '../hooks/use-scroll-area'
import { ScrollAreaProvider } from '../hooks/use-scroll-area-context'

export interface ScrollAreaRootBaseProps
  extends UseScrollAreaProps,
  PolymorphicProps<'div'> {}
export interface ScrollAreaRootProps
  extends Assign<HTMLProps<'div'>, ScrollAreaRootBaseProps> {}

export function ScrollAreaRoot(props: ScrollAreaRootProps) {
  const [useScrollAreaProps, localProps] = createSplitProps<UseScrollAreaProps>()(
    props,
    [
      'defaultScrollLeft',
      'defaultScrollTop',
      'id',
      'ids',
      'onScroll',
      'scrollHideDelay',
      'type',
      'virtual',
    ],
  )
  const scrollArea = useScrollArea(useScrollAreaProps)
  const mergedProps = mergeProps(() => scrollArea().getRootProps(), localProps)

  return (
    <ScrollAreaProvider value={scrollArea}>
      <ui.div {...mergedProps} />
    </ScrollAreaProvider>
  )
}
