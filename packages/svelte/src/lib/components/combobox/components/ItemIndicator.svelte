<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ComboboxItemIndicatorBaseProps extends PolymorphicProps<'div'> {}
  export interface ComboboxItemIndicatorProps extends Assign<HTMLProps<'div'>, ComboboxItemIndicatorBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useComboboxContext } from '../hooks/use-combobox-context'
  import { useComboboxItemPropsContext } from '../hooks/use-combobox-item-props-context'

  const props: ComboboxItemIndicatorProps = $props()

  const combobox = useComboboxContext()
  const itemProps = useComboboxItemPropsContext()
  const mergedProps = $derived(mergeProps(combobox().getItemIndicatorProps(itemProps()), props))
</script>

<UI as="div" {...mergedProps} />
