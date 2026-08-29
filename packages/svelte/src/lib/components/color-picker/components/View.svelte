<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { ColorFormat } from '@destyler/color-picker'

  interface FormatOptions {
    format: ColorFormat
  }

  export interface ColorPickerViewBaseProps extends FormatOptions, PolymorphicProps<'div'> {}
  export interface ColorPickerViewProps extends Assign<HTMLProps<'div'>, ColorPickerViewBaseProps> {}
</script>

<script lang="ts">
  import { UI } from '../../factory'
  import { useColorPickerContext } from '../hooks/use-color-picker-context'
  import { colorPickerAnatomy } from '../anatomy'
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { ColorPickerFormatPropsProvider } from '../hooks/use-color-picker-format-context'

  const props: ColorPickerViewProps = $props()
  const [formatProps, localProps] = $derived(createSplitProps<FormatOptions>()(props, ['format']))

  const colorPicker = useColorPickerContext()

  ColorPickerFormatPropsProvider(() => formatProps)
</script>

{#if colorPicker().format === formatProps.format}
  <UI as="div" data-format={formatProps.format} {...colorPickerAnatomy.build().view.attrs} {...localProps} />
{/if}
