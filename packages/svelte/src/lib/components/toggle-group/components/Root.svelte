<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { UseToggleGroupProps } from '../hooks/use-toggle-group.svelte'

  export interface ToggleGroupRootBaseProps extends Optional<UseToggleGroupProps, 'id'>, PolymorphicProps<'div'> {}
  export interface ToggleGroupRootProps extends Assign<HTMLProps<'div'>, ToggleGroupRootBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { ToggleGroupProvider } from '../hooks/use-toggle-group-context'
  import { useToggleGroup } from '../hooks/use-toggle-group.svelte'

  // Read the parent prop independently from the writable binding. Local writes
  // notify bind: consumers without overriding ordinary controlled props.
  let {
    value = $bindable<string[]>(),
    value: valueProp,
    ...props
  }: ToggleGroupRootProps = $props()

  const [useToggleGroupProps, localProps] = $derived(
    createSplitProps<Optional<UseToggleGroupProps, 'id'>>()(props, [
      'defaultValue',
      'disabled',
      'id',
      'ids',
      'loopFocus',
      'multiple',
      'onValueChange',
      'orientation',
      'rovingFocus',
      'value',
    ]),
  )

  const id = $props.id()

  const machineProps = $derived.by<UseToggleGroupProps>(() => ({
    ...useToggleGroupProps,
    id: useToggleGroupProps.id ?? id,
    value: valueProp,
    onValueChange(details) {
      useToggleGroupProps.onValueChange?.(details)
      value = details.value
    },
  }))

  const toggleGroup = useToggleGroup(() => machineProps)
  const mergedProps = $derived(mergeProps(toggleGroup().getRootProps(), localProps))

  ToggleGroupProvider(() => toggleGroup())
</script>

<UI as="div" {...mergedProps} />
