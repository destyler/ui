<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface FieldLabelBaseProps extends PolymorphicProps<'label'> {}
  export interface FieldLabelProps extends Assign<HTMLProps<'label'>, FieldLabelBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useFieldContext } from '../hooks/use-field-context'

  const props: FieldLabelProps = $props()
  const field = useFieldContext()
  const mergedProps = $derived(mergeProps(field?.().getLabelProps() ?? {}, props))
</script>

<UI as="label" {...mergedProps} />
