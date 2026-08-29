<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SliderMarkerGroupBaseProps extends PolymorphicProps<'div'> {}
  export interface SliderMarkerGroupProps extends Assign<HTMLProps<'div'>, SliderMarkerGroupBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useSliderContext } from '../hooks/use-slider-context'

  const props: SliderMarkerGroupProps = $props()
  const slider = useSliderContext()
  const mergedProps = $derived(mergeProps(slider().getMarkerGroupProps(), props))
</script>

<UI as="div" {...mergedProps} />
