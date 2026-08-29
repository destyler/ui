<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SliderLabelBaseProps extends PolymorphicProps<'label'> {}
  export interface SliderLabelProps extends Assign<HTMLProps<'label'>, SliderLabelBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useSliderContext } from '../hooks/use-slider-context'

  const props: SliderLabelProps = $props()
  const slider = useSliderContext()
  const mergedProps = $derived(mergeProps(slider().getLabelProps(), props))
</script>

<UI as="label" {...mergedProps} />
