<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ColorPickerHiddenInputBaseProps extends PolymorphicProps<'input'> {}
  export interface ColorPickerHiddenInputProps extends Assign<HTMLProps<'input'>, ColorPickerHiddenInputBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useColorPickerContext } from '../hooks/use-color-picker-context'
  import { useFieldContext } from '../../field'

  const props: ColorPickerHiddenInputProps = $props()

  const colorPicker = useColorPickerContext()
  const mergedProps = $derived(mergeProps(colorPicker().getHiddenInputProps(), props))
  const field = useFieldContext()
</script>

<UI as="input" aria-describedby={field?.()?.ariaDescribedby} {...mergedProps} />
