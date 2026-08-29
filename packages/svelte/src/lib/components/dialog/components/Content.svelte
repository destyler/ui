<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface DialogContentBaseProps extends PolymorphicProps<'div'> {
    ref?: Element | null
  }
  export interface DialogContentProps extends Assign<HTMLProps<'div'>, DialogContentBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { untrack } from 'svelte'
  import { UI } from '../../factory'
  import { usePresenceContext } from '../../presence'
  import { useDialogContext } from '../hooks/use-dialog-context'

  let { ref = $bindable<Element | null>(), ...props }: DialogContentProps = $props()

  const dialog = useDialogContext()
  const presence = usePresenceContext()
  const mergedProps = $derived(mergeProps(dialog().getContentProps(), presence().getPresenceProps(), props))

  function setNode(node: Element | null) {
    untrack(() => presence().setNode(node))
    ref = node
  }
</script>

{#if !presence().unmounted}
  <UI as="div" {...mergedProps} {@attach setNode} />
{/if}
