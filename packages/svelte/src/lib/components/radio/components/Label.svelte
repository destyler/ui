<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface RadioLabelBaseProps extends PolymorphicProps<'label'> {}
  export interface RadioLabelProps extends Assign<HTMLProps<'label'>, RadioLabelBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useRadioContext } from '../hooks/use-radio-context'

  const props: RadioLabelProps = $props()
  const radioGroup = useRadioContext()
  const mergedProps = $derived(mergeProps(radioGroup().getLabelProps(), props))
</script>

<UI as="label" {...mergedProps} />
