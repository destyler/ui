<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { UseAspectRatioReturn } from '../hooks/use-aspect-ratio.svelte'

  export interface AspectRatioRootProviderBaseProps extends PolymorphicProps<'div'> {
    value: UseAspectRatioReturn
  }
  export interface AspectRatioRootProviderProps
    extends Assign<HTMLProps<'div'>, AspectRatioRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { AspectRatioProvider } from '../hooks/use-aspect-ratio-context'

  const { value: aspectRatio, ...props }: AspectRatioRootProviderProps = $props()
  const mergedProps = $derived(mergeProps(aspectRatio().getRootProps(), props))

  AspectRatioProvider(() => aspectRatio())
</script>

<UI as="div" {...mergedProps} />
