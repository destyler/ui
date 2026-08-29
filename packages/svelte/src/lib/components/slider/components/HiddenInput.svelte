<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SliderHiddenInputBaseProps extends PolymorphicProps<'input'> {}
  export interface SliderHiddenInputProps extends Assign<HTMLProps<'input'>, SliderHiddenInputBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useSliderContext } from '../hooks/use-slider-context'
  import { useSliderThumbPropsContext } from '../hooks/use-slider-thumb-props-context'

  const props: SliderHiddenInputProps = $props()
  const slider = useSliderContext()
  const thumbProps = useSliderThumbPropsContext()
  const mergedProps = $derived(mergeProps(slider().getHiddenInputProps(thumbProps), props))
</script>

<UI as="input" {...mergedProps} />
