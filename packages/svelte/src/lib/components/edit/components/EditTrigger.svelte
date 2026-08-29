<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface EditEditTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface EditEditTriggerProps extends Assign<HTMLProps<'button'>, EditEditTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useEditContext } from '../hooks/use-edit-context'

  const props: EditEditTriggerProps = $props()

  const edit = useEditContext()
  const mergedProps = $derived(mergeProps(edit().getEditTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />
