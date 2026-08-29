<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SliderRangeBaseProps extends PolymorphicProps<'div'> {}
  export interface SliderRangeProps extends Assign<HTMLProps<'div'>, SliderRangeBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useSliderContext } from '../hooks/use-slider-context'

  const props: SliderRangeProps = $props()
  const slider = useSliderContext()
  const mergedProps = $derived(mergeProps(slider().getRangeProps(), props))
</script>

<UI as="div" {...mergedProps} />
