<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface NumberInputScrubberBaseProps extends PolymorphicProps<'div'> {}
  export interface NumberInputScrubberProps extends Assign<HTMLProps<'div'>, NumberInputScrubberBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useNumberInputContext } from '../hooks/use-number-input-context'

  const props: NumberInputScrubberProps = $props()

  const numberInput = useNumberInputContext()
  const mergedProps = $derived(mergeProps(numberInput().getScrubberProps(), props))
</script>

<UI as="div" {...mergedProps} />
