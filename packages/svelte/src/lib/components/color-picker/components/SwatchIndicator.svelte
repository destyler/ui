<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ColorPickerSwatchIndicatorBaseProps extends PolymorphicProps<'div'> {}
  export interface ColorPickerSwatchIndicatorProps
    extends Assign<HTMLProps<'div'>, ColorPickerSwatchIndicatorBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useColorPickerContext } from '../hooks/use-color-picker-context'
  import { useColorPickerSwatchPropsContext } from '../hooks/use-color-picker-swatch-props-context'

  const props: ColorPickerSwatchIndicatorProps = $props()

  const colorPicker = useColorPickerContext()
  const swatchProps = useColorPickerSwatchPropsContext()
  const mergedProps = $derived(mergeProps(colorPicker().getSwatchIndicatorProps(swatchProps()), props))
</script>

<UI as="div" {...mergedProps} />
