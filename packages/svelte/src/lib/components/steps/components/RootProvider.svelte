<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { UseStepsReturn } from '../hooks/use-steps.svelte'

  export interface StepsRootProviderBaseProps extends PolymorphicProps<'div'> {
    value: UseStepsReturn
  }
  export interface StepsRootProviderProps extends Assign<HTMLProps<'div'>, StepsRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { StepsProvider } from '../hooks/use-steps-context'

  let { value, ...props }: StepsRootProviderProps = $props()

  const mergedProps = $derived(mergeProps(value().getRootProps(), props))

  StepsProvider(() => value())
</script>

<UI as="div" {...mergedProps} />
