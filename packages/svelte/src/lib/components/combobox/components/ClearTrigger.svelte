<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ComboboxClearTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface ComboboxClearTriggerProps extends Assign<HTMLProps<'button'>, ComboboxClearTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useComboboxContext } from '../hooks/use-combobox-context'

  const props: ComboboxClearTriggerProps = $props()

  const combobox = useComboboxContext()
  const mergedProps = $derived(mergeProps(combobox().getClearTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />
