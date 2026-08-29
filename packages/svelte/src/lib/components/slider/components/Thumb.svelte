<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { ThumbProps } from '@destyler/slider'

  export interface SliderThumbBaseProps extends ThumbProps, PolymorphicProps<'div'> {}
  export interface SliderThumbProps extends Assign<HTMLProps<'div'>, SliderThumbBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { createSplitProps } from '../../../utils/create-split-props'
  import { UI } from '../../factory'
  import { useSliderContext } from '../hooks/use-slider-context'
  import SliderThumbPropsProvider from './ThumbPropsProvider.svelte'

  const props: SliderThumbProps = $props()
  const [thumbProps, localProps] = $derived(createSplitProps<ThumbProps>()(props, ['index', 'name']))
  const slider = useSliderContext()
  const mergedProps = $derived(mergeProps(slider().getThumbProps(thumbProps), localProps))
</script>

<SliderThumbPropsProvider value={thumbProps}>
  <UI as="div" {...mergedProps} />
</SliderThumbPropsProvider>
