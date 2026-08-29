<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SwitchThumbBaseProps extends PolymorphicProps<'span'> {}
  export interface SwitchThumbProps extends Assign<HTMLProps<'span'>, SwitchThumbBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useSwitchContext } from '../hooks/use-switch-context'

  const props: SwitchThumbProps = $props()

  const switchMachine = useSwitchContext()
  const mergedProps = $derived(mergeProps(switchMachine().getThumbProps(), props))
</script>

<UI as="span" {...mergedProps} />
