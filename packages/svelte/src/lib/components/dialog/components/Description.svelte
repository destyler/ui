<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface DialogDescriptionBaseProps extends PolymorphicProps<'p'> {}
  export interface DialogDescriptionProps extends Assign<HTMLProps<'p'>, DialogDescriptionBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useDialogContext } from '../hooks/use-dialog-context'

  const props: DialogDescriptionProps = $props()

  const dialog = useDialogContext()
  const mergedProps = $derived(mergeProps(dialog().getDescriptionProps(), props))
</script>

<UI as="p" {...mergedProps} />
