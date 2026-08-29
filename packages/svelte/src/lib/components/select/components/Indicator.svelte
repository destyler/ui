<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SelectIndicatorBaseProps extends PolymorphicProps<'div'> {}
  export interface SelectIndicatorProps extends Assign<HTMLProps<'div'>, SelectIndicatorBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '$lib/components/factory'
  import { useSelectContext } from '../hooks/use-select-context'

  const props: SelectIndicatorProps = $props()
  const select = useSelectContext()
  const mergedProps = $derived(mergeProps(select().getIndicatorProps(), props))
</script>

<UI as="div" {...mergedProps} />
