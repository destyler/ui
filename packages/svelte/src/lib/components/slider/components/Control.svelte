<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SliderControlBaseProps extends PolymorphicProps<'div'> {}
  export interface SliderControlProps extends Assign<HTMLProps<'div'>, SliderControlBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useSliderContext } from '../hooks/use-slider-context'

  const props: SliderControlProps = $props()
  const slider = useSliderContext()
  const mergedProps = $derived(mergeProps(slider().getControlProps(), props))
</script>

<UI as="div" {...mergedProps} />
