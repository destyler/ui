<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ClipboardControlBaseProps extends PolymorphicProps<'div'> {}
  export interface ClipboardControlProps extends Assign<HTMLProps<'div'>, ClipboardControlBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useClipboardContext } from '../hooks/use-clipboard-context'

  const props: ClipboardControlProps = $props()

  const clipboard = useClipboardContext()
  const mergedProps = $derived(mergeProps(clipboard().getControlProps(), props))
</script>

<UI as="div" {...mergedProps} />
