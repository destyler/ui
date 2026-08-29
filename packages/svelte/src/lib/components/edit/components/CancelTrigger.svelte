<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface EditCancelTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface EditCancelTriggerProps extends Assign<HTMLProps<'button'>, EditCancelTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useEditContext } from '../hooks/use-edit-context'

  const props: EditCancelTriggerProps = $props()

  const edit = useEditContext()
  const mergedProps = $derived(mergeProps(edit().getCancelTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />
