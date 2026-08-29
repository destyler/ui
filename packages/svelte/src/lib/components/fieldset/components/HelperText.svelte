<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface FieldsetHelperTextBaseProps extends PolymorphicProps<'span'> {}
  export interface FieldsetHelperTextProps extends Assign<HTMLProps<'span'>, FieldsetHelperTextBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useFieldsetContext } from '../hooks/use-fieldset-context'

  const props: FieldsetHelperTextProps = $props()
  const fieldset = useFieldsetContext()
  const mergedProps = $derived(mergeProps(fieldset?.().getHelperTextProps() ?? {}, props))
</script>

<UI as="span" {...mergedProps} />
