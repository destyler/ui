<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ComboboxInputBaseProps extends PolymorphicProps<'input'> {}
  export interface ComboboxInputProps extends Assign<HTMLProps<'input'>, ComboboxInputBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useComboboxContext } from '../hooks/use-combobox-context'

  const props: ComboboxInputProps = $props()

  const combobox = useComboboxContext()
  const mergedProps = $derived(mergeProps(combobox().getInputProps(), props))
</script>

<UI as="input" {...mergedProps} />
