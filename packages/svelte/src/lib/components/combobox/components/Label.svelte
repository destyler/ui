<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ComboboxLabelBaseProps extends PolymorphicProps<'label'> {}
  export interface ComboboxLabelProps extends Assign<HTMLProps<'label'>, ComboboxLabelBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useComboboxContext } from '../hooks/use-combobox-context'

  const props: ComboboxLabelProps = $props()

  const combobox = useComboboxContext()
  const mergedProps = $derived(mergeProps(combobox().getLabelProps(), props))
</script>

<UI as="label" {...mergedProps} />
