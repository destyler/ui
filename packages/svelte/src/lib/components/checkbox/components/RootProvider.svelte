<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { UseCheckboxReturn } from '../hooks/use-checkbox.svelte'

  export interface CheckboxRootProviderBaseProps extends PolymorphicProps<'label'> {
    value: UseCheckboxReturn
  }
  export interface CheckboxRootProviderProps extends Assign<HTMLProps<'label'>, CheckboxRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { CheckboxProvider } from '../hooks/use-checkbox-context'

  const { value, ...props }: CheckboxRootProviderProps = $props()

  const mergedProps = $derived(mergeProps(value().getRootProps(), props))

  CheckboxProvider(() => value())
</script>

<UI as="label" {...mergedProps} />
