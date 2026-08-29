<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { UseSwitchReturn } from '../hooks/use-switch.svelte'

  export interface SwitchRootProviderBaseProps extends PolymorphicProps<'label'> {
    value: UseSwitchReturn
  }
  export interface SwitchRootProviderProps extends Assign<HTMLProps<'label'>, SwitchRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { SwitchProvider } from '../hooks/use-switch-context'

  let { value, ...props }: SwitchRootProviderProps = $props()

  const mergedProps = $derived(mergeProps(value().getRootProps(), props))

  SwitchProvider(() => value())
</script>

<UI as="label" {...mergedProps} />
