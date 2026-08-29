<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { UseToggleGroupReturn } from '../hooks/use-toggle-group.svelte'

  interface RootProviderProps {
    value: UseToggleGroupReturn
  }

  export interface ToggleGroupRootProviderBaseProps extends RootProviderProps, PolymorphicProps<'div'> {}
  export interface ToggleGroupRootProviderProps extends Assign<HTMLProps<'div'>, ToggleGroupRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { ToggleGroupProvider } from '../hooks/use-toggle-group-context'

  let { value, ...props }: ToggleGroupRootProviderProps = $props()

  const mergedProps = $derived(mergeProps(value().getRootProps(), props))

  ToggleGroupProvider(() => value())
</script>

<UI as="div" {...mergedProps} />
