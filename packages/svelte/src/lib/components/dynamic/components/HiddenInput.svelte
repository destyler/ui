<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface DynamicHiddenInputBaseProps extends PolymorphicProps<'input'> {}
  export interface DynamicHiddenInputProps extends Assign<HTMLProps<'input'>, DynamicHiddenInputBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useFieldContext } from '../../field'
  import { useDynamicContext } from '../hooks/use-dynamic-context'

  const props: DynamicHiddenInputProps = $props()
  const dynamic = useDynamicContext()
  const field = useFieldContext()
  const mergedProps = $derived(mergeProps(dynamic().getHiddenInputProps(), props))
</script>

<UI as="input" aria-describedby={field?.()?.ariaDescribedby} {...mergedProps} />
