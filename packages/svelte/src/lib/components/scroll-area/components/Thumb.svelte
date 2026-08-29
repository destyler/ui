<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps, RefAttribute } from '$lib/types.js'

  export interface ScrollAreaThumbBaseProps extends PolymorphicProps<'div'>, RefAttribute {}
  export interface ScrollAreaThumbProps extends Assign<HTMLProps<'div'>, ScrollAreaThumbBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory/index.js'
  import { useScrollAreaContext } from '../hooks/use-scroll-area-context.js'
  import { useScrollAreaScrollbarContext } from '../hooks/use-scroll-area-scrollbar-context.js'

  let { ref = $bindable(null), ...props }: ScrollAreaThumbProps = $props()

  const scrollAreaApi = useScrollAreaContext()
  const scrollbarProps = useScrollAreaScrollbarContext()

  const mergedProps = $derived(mergeProps(scrollAreaApi().getThumbProps(scrollbarProps()), props))
</script>

<UI as="div" bind:ref {...mergedProps} />
