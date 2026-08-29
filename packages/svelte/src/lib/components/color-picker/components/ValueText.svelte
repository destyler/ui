<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { Color } from '@destyler/color-picker'

  export interface ColorPickerValueTextBaseProps extends PolymorphicProps<'span'> {
    format?: Parameters<Color['toString']>[0]
  }
  export interface ColorPickerValueTextProps extends Assign<HTMLProps<'span'>, ColorPickerValueTextBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useColorPickerContext } from '../hooks/use-color-picker-context'

  let { children, format, ...props }: ColorPickerValueTextProps = $props()

  const colorPicker = useColorPickerContext()
  const mergedProps = $derived(mergeProps(colorPicker().getValueTextProps(), props))
  const valueAsString = $derived(format ? colorPicker().value.toString(format) : colorPicker().valueAsString)
</script>

<UI as="span" {...mergedProps}>
  {#if children}
    {@render children()}
  {:else}
    {valueAsString}
  {/if}
</UI>
