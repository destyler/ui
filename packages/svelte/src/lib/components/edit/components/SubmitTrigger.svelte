<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface EditSubmitTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface EditSubmitTriggerProps extends Assign<HTMLProps<'button'>, EditSubmitTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useEditContext } from '../hooks/use-edit-context'

  const props: EditSubmitTriggerProps = $props()

  const edit = useEditContext()
  const mergedProps = $derived(mergeProps(edit().getSubmitTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />
