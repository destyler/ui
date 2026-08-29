<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface DialogCloseTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface DialogCloseTriggerProps extends Assign<HTMLProps<'button'>, DialogCloseTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useDialogContext } from '../hooks/use-dialog-context'

  const props: DialogCloseTriggerProps = $props()

  const dialog = useDialogContext()
  const mergedProps = $derived(mergeProps(dialog().getCloseTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />
