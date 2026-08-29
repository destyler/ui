<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface FieldsetErrorTextBaseProps extends PolymorphicProps<'span'> {}
  export interface FieldsetErrorTextProps extends Assign<HTMLProps<'span'>, FieldsetErrorTextBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useFieldsetContext } from '../hooks/use-fieldset-context'

  const props: FieldsetErrorTextProps = $props()
  const fieldset = useFieldsetContext()
  const mergedProps = $derived(mergeProps(fieldset?.().getErrorTextProps() ?? {}, props))
</script>

{#if fieldset?.().invalid}
  <UI as="span" {...mergedProps} />
{/if}
