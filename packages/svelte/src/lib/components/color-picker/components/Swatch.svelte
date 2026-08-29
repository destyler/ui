<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { SwatchProps } from '@destyler/color-picker'

  export interface ColorPickerSwatchBaseProps extends SwatchProps, PolymorphicProps<'div'> {}
  export interface ColorPickerSwatchProps extends Assign<HTMLProps<'div'>, ColorPickerSwatchBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useColorPickerContext } from '../hooks/use-color-picker-context'
  import { ColorPickerSwatchPropsProvider } from '../hooks/use-color-picker-swatch-props-context'
  import { createSplitProps } from '$lib/utils/create-split-props'

  const props: ColorPickerSwatchProps = $props()

  const [swatchProps, localProps] = $derived(createSplitProps<SwatchProps>()(props, ['value', 'respectAlpha']))

  const colorPicker = useColorPickerContext()
  const mergedProps = $derived(mergeProps(colorPicker().getSwatchProps(swatchProps), localProps))

  ColorPickerSwatchPropsProvider(() => swatchProps)
</script>

<UI as="div" {...mergedProps} />
