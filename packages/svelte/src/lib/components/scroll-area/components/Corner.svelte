<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps, RefAttribute } from '$lib/types.js'

  export interface ScrollAreaCornerBaseProps extends PolymorphicProps<'div'>, RefAttribute {}
  export interface ScrollAreaCornerProps extends Assign<HTMLProps<'div'>, ScrollAreaCornerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory/index.js'
  import { useScrollAreaContext } from '../hooks/use-scroll-area-context.js'

  let { ref = $bindable(null), ...props }: ScrollAreaCornerProps = $props()

  const scrollArea = useScrollAreaContext()
  const mergedProps = $derived(mergeProps(scrollArea().getCornerProps(), props))
</script>

<UI as="div" bind:ref {...mergedProps} />
