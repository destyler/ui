<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface FieldsetLegendBaseProps extends PolymorphicProps<'legend'> {}
  export interface FieldsetLegendProps extends Assign<HTMLProps<'legend'>, FieldsetLegendBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useFieldsetContext } from '../hooks/use-fieldset-context'

  const props: FieldsetLegendProps = $props()
  const fieldset = useFieldsetContext()
  const mergedProps = $derived(mergeProps(fieldset?.().getLegendProps() ?? {}, props))
</script>

<UI as="legend" {...mergedProps} />
