<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SelectTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface SelectTriggerProps extends Assign<HTMLProps<'button'>, SelectTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '$lib/components/factory'
  import { useSelectContext } from '../hooks/use-select-context'

  const props: SelectTriggerProps = $props()
  const select = useSelectContext()
  const mergedProps = $derived(mergeProps(select().getTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />
