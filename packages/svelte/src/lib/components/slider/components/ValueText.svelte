<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SliderValueTextBaseProps extends PolymorphicProps<'span'> {}
  export interface SliderValueTextProps extends Assign<HTMLProps<'span'>, SliderValueTextBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useSliderContext } from '../hooks/use-slider-context'

  let { children, ...props }: SliderValueTextProps = $props()
  const slider = useSliderContext()
  const mergedProps = $derived(mergeProps(slider().getValueTextProps(), props))
</script>

<UI as="span" {...mergedProps}>
  {#if children}
    {@render children()}
  {:else}
    {slider().value.join(', ')}
  {/if}
</UI>
