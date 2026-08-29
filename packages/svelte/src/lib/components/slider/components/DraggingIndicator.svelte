<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SliderDraggingIndicatorBaseProps extends PolymorphicProps<'span'> {}
  export interface SliderDraggingIndicatorProps extends Assign<HTMLProps<'span'>, SliderDraggingIndicatorBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useSliderContext } from '../hooks/use-slider-context'
  import { useSliderThumbPropsContext } from '../hooks/use-slider-thumb-props-context'

  const props: SliderDraggingIndicatorProps = $props()
  const slider = useSliderContext()
  const { index } = useSliderThumbPropsContext()
  const mergedProps = $derived(mergeProps(slider().getDraggingIndicatorProps({ index }), props))
</script>

<UI as="span" {...mergedProps}>
  {#if props.children}
    {@render props.children()}
  {:else}
    {slider().getThumbValue(index)}
  {/if}
</UI>
