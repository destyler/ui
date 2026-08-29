<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { SwatchProps } from '@destyler/color-picker'

  interface ValueSwatchProps extends Omit<SwatchProps, 'value'> {}

  export interface ColorPickerValueSwatchBaseProps extends ValueSwatchProps, PolymorphicProps<'div'> {}
  export interface ColorPickerValueSwatchProps extends Assign<HTMLProps<'div'>, ColorPickerValueSwatchBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useColorPickerContext } from '../hooks/use-color-picker-context'
  import { ColorPickerSwatchPropsProvider } from '../hooks/use-color-picker-swatch-props-context'

  const props: ColorPickerValueSwatchProps = $props()

  const [valueSwatchProps, localProps] = $derived(createSplitProps<ValueSwatchProps>()(props, ['respectAlpha']))

  const colorPicker = useColorPickerContext()

  const swatchProps = $derived({
    ...valueSwatchProps,
    value: colorPicker().valueAsString,
  })

  const mergedProps = $derived(mergeProps(colorPicker().getSwatchProps(swatchProps), localProps))

  ColorPickerSwatchPropsProvider(() => swatchProps)
</script>

<UI as="div" {...mergedProps} />
