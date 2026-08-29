<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ColorPickerEyeDropperTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface ColorPickerEyeDropperTriggerProps
    extends Assign<HTMLProps<'button'>, ColorPickerEyeDropperTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useColorPickerContext } from '../hooks/use-color-picker-context'

  const props: ColorPickerEyeDropperTriggerProps = $props()

  const colorPicker = useColorPickerContext()
  const mergedProps = $derived(mergeProps(colorPicker().getEyeDropperTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />
