<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { UseLabelProps } from '../hooks/use-label.svelte'
  export interface LabelRootBaseProps extends Optional<UseLabelProps, 'id'>, PolymorphicProps<'label'> {}
  export interface LabelRootProps extends Assign<HTMLProps<'label'>, LabelRootBaseProps> {}
</script>
<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { LabelProvider } from '../hooks/use-label-context'
  import { useLabel } from '../hooks/use-label.svelte'
  const { id, ids, ...localProps }: LabelRootProps = $props()
  const providedId = $props.id()
  const label = useLabel(() => ({ id: id ?? providedId, ids }))
  const mergedProps = $derived(mergeProps(label().getRootProps(), localProps))
  LabelProvider(() => label())
</script>
<UI as="label" {...mergedProps} />
