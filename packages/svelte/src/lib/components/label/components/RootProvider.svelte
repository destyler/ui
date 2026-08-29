<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { UseLabelReturn } from '../hooks/use-label.svelte'
  export interface LabelRootProviderBaseProps extends PolymorphicProps<'label'> { value: UseLabelReturn }
  export interface LabelRootProviderProps extends Assign<HTMLProps<'label'>, LabelRootProviderBaseProps> {}
</script>
<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { LabelProvider } from '../hooks/use-label-context'
  const { value: label, ...props }: LabelRootProviderProps = $props()
  const mergedProps = $derived(mergeProps(label().getRootProps(), props))
  LabelProvider(() => label())
</script>
<UI as="label" {...mergedProps} />
