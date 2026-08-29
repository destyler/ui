<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface DynamicInputBaseProps extends PolymorphicProps<'input'> {}
  export interface DynamicInputProps extends Assign<HTMLProps<'input'>, DynamicInputBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useDynamicContext } from '../hooks/use-dynamic-context'

  const props: DynamicInputProps = $props()
  const dynamic = useDynamicContext()
  const mergedProps = $derived(mergeProps(dynamic().getInputProps(), props))
</script>

<UI as="input" {...mergedProps} />
