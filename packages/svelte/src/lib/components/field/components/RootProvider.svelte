<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { UseFieldReturn } from '../hooks/use-field.svelte'

  export interface FieldRootProviderBaseProps extends PolymorphicProps<'div'> {
    value: UseFieldReturn
  }
  export interface FieldRootProviderProps extends Assign<HTMLProps<'div'>, FieldRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { FieldProvider } from '../hooks/use-field-context'

  const { value, ...props }: FieldRootProviderProps = $props()
  const mergedProps = $derived(mergeProps(value().getRootProps(), props))

  FieldProvider(() => value())
</script>

<UI as="div" {...mergedProps} />
