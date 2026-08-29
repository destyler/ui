<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ComboboxItemTextBaseProps extends PolymorphicProps<'span'> {}
  export interface ComboboxItemTextProps extends Assign<HTMLProps<'span'>, ComboboxItemTextBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useComboboxContext } from '../hooks/use-combobox-context'
  import { useComboboxItemPropsContext } from '../hooks/use-combobox-item-props-context'

  const props: ComboboxItemTextProps = $props()

  const combobox = useComboboxContext()
  const itemProps = useComboboxItemPropsContext()
  const mergedProps = $derived(mergeProps(combobox().getItemTextProps(itemProps()), props))
</script>

<UI as="span" {...mergedProps} />
