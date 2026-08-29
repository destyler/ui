<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SelectListBaseProps extends PolymorphicProps<'div'> {}
  export interface SelectListProps extends Assign<HTMLProps<'div'>, SelectListBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '$lib/components/factory'
  import { useSelectContext } from '../hooks/use-select-context'

  const props: SelectListProps = $props()
  const select = useSelectContext()
  const mergedProps = $derived(mergeProps(select().getListProps(), props))
</script>

<UI as="div" {...mergedProps} />
