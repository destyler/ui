<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { UseSplitterReturn } from '../hooks/use-splitter.svelte'

  export interface SplitterRootProviderBaseProps extends PolymorphicProps<'div'> {
    value: UseSplitterReturn
  }
  export interface SplitterRootProviderProps extends Assign<HTMLProps<'div'>, SplitterRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { SplitterProvider } from '../hooks/use-splitter-context'

  const { value, ...props }: SplitterRootProviderProps = $props()

  const mergedProps = $derived(mergeProps(value().getRootProps(), props))

  SplitterProvider(() => value())
</script>

<UI as="div" {...mergedProps} />
