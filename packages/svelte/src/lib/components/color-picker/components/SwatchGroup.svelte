<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ColorPickerSwatchGroupBaseProps extends PolymorphicProps<'div'> {}
  export interface ColorPickerSwatchGroupProps extends Assign<HTMLProps<'div'>, ColorPickerSwatchGroupBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useColorPickerContext } from '../hooks/use-color-picker-context'

  const props: ColorPickerSwatchGroupProps = $props()

  const colorPicker = useColorPickerContext()
  const mergedProps = $derived(mergeProps(colorPicker().getSwatchGroupProps(), props))
</script>

<UI as="div" {...mergedProps} />
