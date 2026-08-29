<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SelectItemTextBaseProps extends PolymorphicProps<'span'> {}
  export interface SelectItemTextProps extends Assign<HTMLProps<'span'>, SelectItemTextBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '$lib/components/factory'
  import { useSelectContext } from '../hooks/use-select-context'
  import { useSelectItemPropsContext } from '../hooks/use-select-item-props-context'

  const props: SelectItemTextProps = $props()
  const select = useSelectContext()
  const itemProps = useSelectItemPropsContext()
  const mergedProps = $derived(mergeProps(select().getItemTextProps(itemProps()), props))
</script>

<UI as="span" {...mergedProps} />
