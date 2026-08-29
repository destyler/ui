<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ColorPickerFormatSelectBaseProps extends PolymorphicProps<'select'> {}
  export interface ColorPickerFormatSelectProps extends Assign<HTMLProps<'select'>, ColorPickerFormatSelectBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useColorPickerContext } from '../hooks/use-color-picker-context'

  const props: ColorPickerFormatSelectProps = $props()

  const colorPicker = useColorPickerContext()
  const mergedProps = $derived(mergeProps(colorPicker().getFormatSelectProps(), props))
</script>

<UI as="select" {...mergedProps} value={colorPicker().format}>
  {#each ['rgba', 'hsla', 'hsba'] as format}
    <option value={format}>{format}</option>
  {/each}
</UI>
