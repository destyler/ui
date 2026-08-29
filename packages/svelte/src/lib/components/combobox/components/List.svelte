<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ComboboxListBaseProps extends PolymorphicProps<'div'> {}
  export interface ComboboxListProps extends Assign<HTMLProps<'div'>, ComboboxListBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useComboboxContext } from '../hooks/use-combobox-context'

  const props: ComboboxListProps = $props()

  const combobox = useComboboxContext()
  const mergedProps = $derived(mergeProps(combobox().getListProps(), props))
</script>

<UI as="div" {...mergedProps} />
