<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ComboboxControlBaseProps extends PolymorphicProps<'div'> {}
  export interface ComboboxControlProps extends Assign<HTMLProps<'div'>, ComboboxControlBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useComboboxContext } from '../hooks/use-combobox-context'

  const props: ComboboxControlProps = $props()

  const combobox = useComboboxContext()
  const mergedProps = $derived(mergeProps(combobox().getControlProps(), props))
</script>

<UI as="div" {...mergedProps} />
