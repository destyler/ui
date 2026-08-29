<script module lang="ts">
  import type { Assign, HTMLProps } from '$lib/types'
  import type { UseSliderReturn } from '../hooks/use-slider.svelte'

  interface RootProviderProps {
    value: UseSliderReturn
  }

  export interface SliderRootProviderBaseProps extends RootProviderProps {}
  export interface SliderRootProviderProps extends Assign<HTMLProps<'div'>, SliderRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { SliderProvider } from '../hooks/use-slider-context'

  const { value: slider, ...localProps }: SliderRootProviderProps = $props()
  const mergedProps = $derived(mergeProps(slider().getRootProps(), localProps))

  SliderProvider(() => slider())
</script>

<UI as="div" {...mergedProps} />
