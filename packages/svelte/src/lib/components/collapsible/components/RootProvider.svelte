<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { UseCollapsibleReturn } from '../hooks/use-collapsible.svelte'

  interface RootProviderProps {
    value: UseCollapsibleReturn
  }

  export interface CollapsibleRootProviderBaseProps extends RootProviderProps, PolymorphicProps<'div'> {}
  export interface CollapsibleRootProviderProps extends Assign<HTMLProps<'div'>, CollapsibleRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { CollapsibleProvider } from '../hooks/use-collapsible-context'

  const { value, ...props }: CollapsibleRootProviderProps = $props()
  const mergedProps = $derived(mergeProps(value().getRootProps(), props))

  CollapsibleProvider(() => value())
</script>

<UI as="div" {...mergedProps} />
