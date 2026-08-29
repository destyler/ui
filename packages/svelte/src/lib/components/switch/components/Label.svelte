<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SwitchLabelBaseProps extends PolymorphicProps<'span'> {}
  export interface SwitchLabelProps extends Assign<HTMLProps<'span'>, SwitchLabelBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useSwitchContext } from '../hooks/use-switch-context'

  const props: SwitchLabelProps = $props()

  const switchMachine = useSwitchContext()
  const mergedProps = $derived(mergeProps(switchMachine().getLabelProps(), props))
</script>

<UI as="span" {...mergedProps} />
