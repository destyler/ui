<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SelectLabelBaseProps extends PolymorphicProps<'label'> {}
  export interface SelectLabelProps extends Assign<HTMLProps<'label'>, SelectLabelBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '$lib/components/factory'
  import { useSelectContext } from '../hooks/use-select-context'

  const props: SelectLabelProps = $props()
  const select = useSelectContext()
  const mergedProps = $derived(mergeProps(select().getLabelProps(), props))
</script>

<UI as="label" {...mergedProps} />
