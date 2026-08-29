<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface DynamicHiddenInputBaseProps extends PolymorphicProps<'input'> {}
  export interface DynamicHiddenInputProps extends Assign<HTMLProps<'input'>, DynamicHiddenInputBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useDynamicContext } from '../hooks/use-dynamic-context'

  const props: DynamicHiddenInputProps = $props()
  const dynamic = useDynamicContext()
  const mergedProps = $derived(mergeProps(dynamic().getHiddenInputProps(), props))
</script>

<UI as="input" {...mergedProps} />
