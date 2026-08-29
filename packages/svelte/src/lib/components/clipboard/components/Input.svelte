<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ClipboardInputBaseProps extends PolymorphicProps<'input'> {}
  export interface ClipboardInputProps extends Assign<HTMLProps<'input'>, ClipboardInputBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useClipboardContext } from '../hooks/use-clipboard-context'

  const props: ClipboardInputProps = $props()

  const clipboard = useClipboardContext()
  const mergedProps = $derived(mergeProps(clipboard().getInputProps(), props))
</script>

<UI as="input" {...mergedProps} />
