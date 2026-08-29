<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { UseCollapsibleProps } from '../hooks/use-collapsible.svelte'

  export interface CollapsibleRootBaseProps extends Optional<UseCollapsibleProps, 'id'>, PolymorphicProps<'div'> {}
  export interface CollapsibleRootProps extends Assign<HTMLProps<'div'>, CollapsibleRootBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { CollapsibleProvider } from '../hooks/use-collapsible-context'
  import { splitCollapsibleProps } from '../hooks/split-collapsible-props.svelte'
  import { useCollapsible } from '../hooks/use-collapsible.svelte'

  let { open = $bindable(), ...props }: CollapsibleRootProps = $props()
  const providedId = $props.id()

  const [useCollapsibleProps, localProps] = $derived(splitCollapsibleProps(props))

  const resolvedProps = $derived<UseCollapsibleProps>({
    ...useCollapsibleProps,
    id: useCollapsibleProps.id ?? providedId,
    open,
    onOpenChange(details) {
      useCollapsibleProps.onOpenChange?.(details)
      if (open !== undefined) open = details.open
    },
  })

  const collapsible = useCollapsible(() => resolvedProps)
  const mergedProps = $derived(mergeProps(collapsible().getRootProps(), localProps))

  CollapsibleProvider(() => collapsible())
</script>

<UI as="div" {...mergedProps} />
