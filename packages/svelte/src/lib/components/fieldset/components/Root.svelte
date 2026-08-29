<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { UseFieldsetProps } from '../hooks/use-fieldset.svelte'

  export interface FieldsetRootBaseProps extends Optional<UseFieldsetProps, 'id'>, PolymorphicProps<'fieldset'> {
    ref?: Element | null
  }
  export interface FieldsetRootProps extends Assign<HTMLProps<'fieldset'>, FieldsetRootBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { untrack } from 'svelte'
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { UI } from '../../factory'
  import { FieldsetProvider } from '../hooks/use-fieldset-context'
  import { useFieldset } from '../hooks/use-fieldset.svelte'

  let { ref = $bindable<Element | null>(null), ...props }: FieldsetRootProps = $props()

  const [useFieldsetProps, localProps] = $derived(
    createSplitProps<Optional<UseFieldsetProps, 'id'>>()(props, ['id', 'disabled', 'invalid']),
  )

  const providedId = $props.id()

  const machineProps = $derived.by<UseFieldsetProps>(() => {
    return {
      ...useFieldsetProps,
      id: useFieldsetProps.id ?? providedId,
    }
  })

  const fieldset = useFieldset(() => machineProps)
  const mergedProps = $derived(mergeProps(fieldset().getRootProps(), localProps))

  FieldsetProvider(fieldset)

  function setNode(node: Element | null) {
    untrack(() => fieldset().setRootRef(node))
    ref = node
  }
</script>

<UI as="fieldset" {...mergedProps} {@attach setNode} />
