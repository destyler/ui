<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { UseFieldProps } from '../hooks/use-field.svelte'

  export interface FieldRootBaseProps extends Optional<UseFieldProps, 'id'>, PolymorphicProps<'div'> {
    ref?: Element | null
  }
  export interface FieldRootProps extends Assign<HTMLProps<'div'>, FieldRootBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { mergeProps } from '@destyler/svelte'
  import { untrack } from 'svelte'
  import { UI } from '../../factory'
  import { FieldProvider } from '../hooks/use-field-context'
  import { useField } from '../hooks/use-field.svelte'

  let { ref = $bindable<Element | null>(null), ...props }: FieldRootProps = $props()

  const [useFieldProps, localProps] = $derived(
    createSplitProps<Optional<UseFieldProps, 'id'>>()(props, [
      'id',
      'ids',
      'disabled',
      'invalid',
      'readOnly',
      'required',
    ]),
  )

  const providedId = $props.id()

  const machineProps = $derived.by(() => {
    return {
      ...useFieldProps,
      id: useFieldProps.id ?? providedId,
    }
  })

  const field = useField(() => machineProps)
  const mergedProps = $derived(mergeProps(field().getRootProps(), localProps))

  FieldProvider(field)

  function setNode(node: Element | null) {
    untrack(() => field().setRootRef(node))
    ref = node
  }
</script>

<UI as="div" {...mergedProps} {@attach setNode} />
