<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { UseFieldsetReturn } from '../hooks/use-fieldset.svelte'

  export interface FieldsetRootProviderBaseProps extends PolymorphicProps<'fieldset'> {
    value: UseFieldsetReturn
  }
  export interface FieldsetRootProviderProps extends Assign<HTMLProps<'fieldset'>, FieldsetRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { FieldsetProvider } from '../hooks/use-fieldset-context'

  const { value, ...props }: FieldsetRootProviderProps = $props()
  const mergedProps = $derived(mergeProps(value().getRootProps(), props))

  FieldsetProvider(() => value())
</script>

<UI as="fieldset" {...mergedProps} />
