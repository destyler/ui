<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SelectItemGroupBaseProps extends PolymorphicProps<'div'> {
    id?: string
  }
  export interface SelectItemGroupProps extends Assign<HTMLProps<'div'>, SelectItemGroupBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '$lib/components/factory'
  import { useSelectContext } from '../hooks/use-select-context'
  import { SelectItemGroupPropsProvider } from '../hooks/use-select-item-group-props-context'

  const props: SelectItemGroupProps = $props()
  const providedId = $props.id()

  const groupProps = $derived({ id: props.id ?? providedId })
  const select = useSelectContext()
  const mergedProps = $derived(mergeProps(select().getItemGroupProps(groupProps), props))

  SelectItemGroupPropsProvider(() => groupProps)
</script>

<UI as="div" {...mergedProps} />
