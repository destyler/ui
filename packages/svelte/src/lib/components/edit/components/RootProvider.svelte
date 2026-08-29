<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { UseEditReturn } from '../hooks/use-edit.svelte'

  export interface EditRootProviderBaseProps extends PolymorphicProps<'div'> {
    value: UseEditReturn
  }
  export interface EditRootProviderProps extends Assign<HTMLProps<'div'>, EditRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { EditProvider } from '../hooks/use-edit-context'

  let { value, ...props }: EditRootProviderProps = $props()

  EditProvider(() => value())

  const mergedProps = $derived(mergeProps(value().getRootProps(), props))
</script>

<UI as="div" {...mergedProps} />
