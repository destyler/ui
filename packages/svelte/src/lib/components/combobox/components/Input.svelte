<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ComboboxInputBaseProps extends PolymorphicProps<'input'> {}
  export interface ComboboxInputProps extends Assign<HTMLProps<'input'>, ComboboxInputBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { createInputValueSync } from '$lib/utils/sync-input-value'
  import { UI } from '../../factory'
  import { useFieldContext } from '../../field'
  import { useComboboxContext } from '../hooks/use-combobox-context'

  const props: ComboboxInputProps = $props()

  const combobox = useComboboxContext()
  const field = useFieldContext()
  const syncInputValue = createInputValueSync(() => combobox().getInputProps(), () => combobox().inputValue)
  const mergedProps = $derived(mergeProps(combobox().getInputProps(), props, {
    oninput: syncInputValue,
    oncompositionend: syncInputValue,
  }))
</script>

<UI as="input" aria-describedby={field?.()?.ariaDescribedby} {...mergedProps} />
