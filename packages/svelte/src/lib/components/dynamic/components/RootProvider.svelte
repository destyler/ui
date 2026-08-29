<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { UseDynamicReturn } from '../hooks/use-dynamic.svelte'

  export interface DynamicRootProviderBaseProps extends PolymorphicProps<'div'> {
    value: UseDynamicReturn
  }
  export interface DynamicRootProviderProps extends Assign<HTMLProps<'div'>, DynamicRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { DynamicProvider } from '../hooks/use-dynamic-context'

  const { value, ...props }: DynamicRootProviderProps = $props()

  const mergedProps = $derived(mergeProps(value().getRootProps(), props))

  DynamicProvider(() => value())
</script>

<UI as="div" {...mergedProps} />
