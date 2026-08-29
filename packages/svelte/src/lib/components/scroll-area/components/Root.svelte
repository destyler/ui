<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps, RefAttribute } from '$lib/types.js'
  import type { UseScrollAreaProps } from '../hooks/use-scroll-area.svelte.js'

  export interface ScrollAreaRootBaseProps
    extends Optional<UseScrollAreaProps, 'id'>,
      PolymorphicProps<'div'>,
      RefAttribute {}
  export interface ScrollAreaRootProps extends Assign<HTMLProps<'div'>, ScrollAreaRootBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props.js'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory/index.js'
  import { ScrollAreaProvider } from '../hooks/use-scroll-area-context.js'
  import { useScrollArea } from '../hooks/use-scroll-area.svelte.js'

  let { ref = $bindable(null), ...props }: ScrollAreaRootProps = $props()
  const providedId = $props.id()

  const [scrollAreaProps, localProps] = $derived(
    createSplitProps<Optional<UseScrollAreaProps, 'id'>>()(props, [
      'defaultScrollLeft',
      'defaultScrollTop',
      'id',
      'ids',
      'onScroll',
      'scrollHideDelay',
      'type',
      'virtual',
    ]),
  )

  const resolvedProps = $derived<UseScrollAreaProps>({
    ...scrollAreaProps,
    id: scrollAreaProps.id ?? providedId,
  })

  const scrollArea = useScrollArea(() => resolvedProps)
  const mergedProps = $derived(mergeProps(scrollArea().getRootProps(), localProps))

  ScrollAreaProvider(scrollArea)
</script>

<UI as="div" bind:ref {...mergedProps} />
