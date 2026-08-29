<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SelectHiddenSelectBaseProps extends PolymorphicProps<'select'> {}
  export interface SelectHiddenSelectProps extends Assign<HTMLProps<'select'>, SelectHiddenSelectBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '$lib/components/factory'
  import { useFieldContext } from '../../field'
  import { useSelectContext } from '../hooks/use-select-context'

  const props: SelectHiddenSelectProps = $props()
  const select = useSelectContext()
  const field = useFieldContext()
  const value = $derived(select().multiple ? select().value : (select().value[0] ?? ''))
  const mergedProps = $derived(mergeProps(select().getHiddenSelectProps(), { value }, props))
</script>

<UI as="select" aria-describedby={field?.()?.ariaDescribedby} {...mergedProps}>
  {#if select().value.length === 0}
    <option value=""></option>
  {/if}
  {#each select().collection.items as item}
    <option
      value={select().collection.getItemValue(item) ?? ''}
      disabled={select().collection.getItemDisabled(item)}
    >
      {select().collection.stringifyItem(item)}
    </option>
  {/each}
</UI>
