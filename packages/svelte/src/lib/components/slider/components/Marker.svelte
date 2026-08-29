<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { MarkerProps } from '@destyler/slider'

  export interface SliderMarkerBaseProps extends MarkerProps, PolymorphicProps<'span'> {}
  export interface SliderMarkerProps extends Assign<HTMLProps<'span'>, SliderMarkerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { createSplitProps } from '../../../utils/create-split-props'
  import { UI } from '../../factory'
  import { useSliderContext } from '../hooks/use-slider-context'

  const props: SliderMarkerProps = $props()
  const [markerProps, localProps] = $derived(createSplitProps<MarkerProps>()(props, ['value']))
  const slider = useSliderContext()
  const mergedProps = $derived(mergeProps(slider().getMarkerProps(markerProps), localProps))
</script>

<UI as="span" {...mergedProps} />
