<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ComboboxTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface ComboboxTriggerProps extends Assign<HTMLProps<'button'>, ComboboxTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useComboboxContext } from '../hooks/use-combobox-context'

  const props: ComboboxTriggerProps = $props()

  const combobox = useComboboxContext()
  const mergedProps = $derived(mergeProps(combobox().getTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />
