<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { UseSeparatorProps } from '../hooks/use-separator.svelte'
  export interface SeparatorRootBaseProps extends Optional<UseSeparatorProps, 'id'>, PolymorphicProps<'div'> {}
  export interface SeparatorRootProps extends Assign<HTMLProps<'div'>, SeparatorRootBaseProps> {}
</script>
<script lang="ts">
  import * as separatorMachine from '@destyler/separator'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { SeparatorProvider } from '../hooks/use-separator-context'
  import { useSeparator } from '../hooks/use-separator.svelte'
  const props: SeparatorRootProps = $props()
  const providedId = $props.id()
  const [machineProps, localProps] = $derived(separatorMachine.splitProps(props))
  const resolvedProps = $derived<UseSeparatorProps>({ ...machineProps, id: machineProps.id ?? providedId })
  const separator = useSeparator(() => resolvedProps)
  const mergedProps = $derived(mergeProps(separator().getRootProps(resolvedProps.orientation), localProps))
  SeparatorProvider(() => separator())
</script>
<UI as="div" {...mergedProps} />
