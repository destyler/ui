<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SliderTrackBaseProps extends PolymorphicProps<'div'> {}
  export interface SliderTrackProps extends Assign<HTMLProps<'div'>, SliderTrackBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useSliderContext } from '../hooks/use-slider-context'

  const props: SliderTrackProps = $props()
  const slider = useSliderContext()
  const mergedProps = $derived(mergeProps(slider().getTrackProps(), props))
</script>

<UI as="div" {...mergedProps} />
