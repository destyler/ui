<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps, RefAttribute } from '$lib/types.js'
  import type { ScrollbarProps } from '@destyler/scroll-area'

  export interface ScrollAreaScrollbarBaseProps extends ScrollbarProps, PolymorphicProps<'div'>, RefAttribute {}
  export interface ScrollAreaScrollbarProps extends Assign<HTMLProps<'div'>, ScrollAreaScrollbarBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory/index.js'
  import { useScrollAreaContext } from '../hooks/use-scroll-area-context.js'
  import { ScrollAreaScrollbarProvider } from '../hooks/use-scroll-area-scrollbar-context.js'

  let { ref = $bindable(null), orientation = 'vertical', ...props }: ScrollAreaScrollbarProps = $props()

  const scrollbarProps = $derived<ScrollbarProps>({ orientation })

  const scrollAreaApi = useScrollAreaContext()
  const mergedProps = $derived(mergeProps(scrollAreaApi().getScrollbarProps(scrollbarProps), props))

  ScrollAreaScrollbarProvider(() => scrollbarProps)
</script>

<UI as="div" bind:ref {...mergedProps} />
