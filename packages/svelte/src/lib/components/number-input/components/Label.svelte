<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface NumberInputLabelBaseProps extends PolymorphicProps<'label'> {}
  export interface NumberInputLabelProps extends Assign<HTMLProps<'label'>, NumberInputLabelBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useNumberInputContext } from '../hooks/use-number-input-context'

  const props: NumberInputLabelProps = $props()

  const numberInput = useNumberInputContext()
  const mergedProps = $derived(mergeProps(numberInput().getLabelProps(), props))
</script>

<UI as="label" {...mergedProps} />
