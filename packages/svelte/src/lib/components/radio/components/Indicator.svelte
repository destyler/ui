<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface RadioIndicatorBaseProps extends PolymorphicProps<'div'> {}
  export interface RadioIndicatorProps extends Assign<HTMLProps<'div'>, RadioIndicatorBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useRadioContext } from '../hooks/use-radio-context'

  const props: RadioIndicatorProps = $props()

  const radioGroup = useRadioContext()
  const mergedProps = $derived(mergeProps(radioGroup().getIndicatorProps(), props))
</script>

<UI as="div" {...mergedProps} />
