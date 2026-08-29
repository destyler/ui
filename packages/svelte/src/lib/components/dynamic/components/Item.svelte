<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface DynamicItemBaseProps extends PolymorphicProps<'div'> {
    index: number
    value: string
    disabled?: boolean
  }
  export interface DynamicItemProps extends Assign<HTMLProps<'div'>, DynamicItemBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useDynamicContext } from '../hooks/use-dynamic-context'
  import { DynamicItemProvider } from '../hooks/use-dynamic-item-context'
  import { DynamicItemPropsProvider } from '../hooks/use-dynamic-item-props-context'

  const props: DynamicItemProps = $props()
  const dynamic = useDynamicContext()
  const itemProps = $derived({ index: props.index, value: props.value, disabled: props.disabled })
  const mergedProps = $derived(mergeProps(dynamic().getItemProps(itemProps), props))

  DynamicItemProvider(() => ({ index: props.index, value: props.value }))
  DynamicItemPropsProvider(() => itemProps)
</script>

<UI as="div" {...mergedProps} />
