<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SelectItemIndicatorBaseProps extends PolymorphicProps<'div'> {}
  export interface SelectItemIndicatorProps extends Assign<HTMLProps<'div'>, SelectItemIndicatorBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '$lib/components/factory'
  import { useSelectContext } from '../hooks/use-select-context'
  import { useSelectItemPropsContext } from '../hooks/use-select-item-props-context'

  const props: SelectItemIndicatorProps = $props()
  const select = useSelectContext()
  const itemProps = useSelectItemPropsContext()
  const mergedProps = $derived(mergeProps(select().getItemIndicatorProps(itemProps()), props))
</script>

<UI as="div" {...mergedProps} />
