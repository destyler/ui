<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { UseAspectRatioProps } from '../hooks/use-aspect-ratio.svelte'

  export interface AspectRatioRootBaseProps extends Optional<UseAspectRatioProps, 'id'>, PolymorphicProps<'div'> {}
  export interface AspectRatioRootProps extends Assign<HTMLProps<'div'>, AspectRatioRootBaseProps> {}
</script>

<script lang="ts">
  import * as aspectRatioMachine from '@destyler/aspect-ratio'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { AspectRatioProvider } from '../hooks/use-aspect-ratio-context'
  import { useAspectRatio } from '../hooks/use-aspect-ratio.svelte'

  let { defaultRatio, ...props }: AspectRatioRootProps = $props()
  const providedId = $props.id()

  const [machineProps, localProps] = $derived(aspectRatioMachine.splitProps(props))
  const resolvedProps = $derived<UseAspectRatioProps>({
    ...machineProps,
    id: machineProps.id ?? providedId,
    defaultRatio,
  })
  const aspectRatio = useAspectRatio(() => resolvedProps)
  const mergedProps = $derived(mergeProps(aspectRatio().getRootProps(), localProps))

  AspectRatioProvider(() => aspectRatio())
</script>

<UI as="div" {...mergedProps} />
