<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SwitchHiddenInputBaseProps extends PolymorphicProps<'input'> {}
  export interface SwitchHiddenInputProps extends Assign<HTMLProps<'input'>, SwitchHiddenInputBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useSwitchContext } from '../hooks/use-switch-context'

  const props: SwitchHiddenInputProps = $props()

  const switchMachine = useSwitchContext()
  const mergedProps = $derived(mergeProps(switchMachine().getHiddenInputProps(), props))
</script>

<UI as="input" {...mergedProps} />
