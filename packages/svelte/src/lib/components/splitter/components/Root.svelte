<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { PanelSizeData, SizeChangeDetails } from '@destyler/splitter'
  import type { UseSplitterProps } from '../hooks/use-splitter.svelte'

  export interface SplitterRootBaseProps extends Optional<UseSplitterProps, 'id'>, PolymorphicProps<'div'> {}
  export interface SplitterRootProps extends Assign<HTMLProps<'div'>, SplitterRootBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { splitSplitterProps } from '../hooks/splitter-split-props.svelte'
  import { SplitterProvider } from '../hooks/use-splitter-context'
  import { useSplitter } from '../hooks/use-splitter.svelte'

  let { size = $bindable<PanelSizeData[]>(), ...props }: SplitterRootProps = $props()

  const [useSplitterProps, localProps] = $derived(splitSplitterProps(props))

  const id = $props.id()

  const machineProps = $derived.by(() => ({
    ...useSplitterProps,
    id: useSplitterProps.id ?? id,
    size,
    onSizeChange: (details: SizeChangeDetails) => {
      useSplitterProps.onSizeChange?.(details)
      if (size !== undefined) size = details.size
    },
  }))

  const splitter = useSplitter(() => machineProps)
  const mergedProps = $derived(mergeProps(splitter().getRootProps(), localProps))

  SplitterProvider(() => splitter())
</script>

<UI as="div" {...mergedProps} />
