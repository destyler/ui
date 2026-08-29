<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { UseClipboardProps } from '../hooks/use-clipboard.svelte'

  export interface ClipboardRootBaseProps extends Optional<UseClipboardProps, 'id'>, PolymorphicProps<'div'> {}
  export interface ClipboardRootProps extends Assign<HTMLProps<'div'>, ClipboardRootBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { splitClipboardProps } from '../hooks/clipboard-split-props.svelte'
  import { ClipboardProvider } from '../hooks/use-clipboard-context'
  import { useClipboard } from '../hooks/use-clipboard.svelte'

  const props: ClipboardRootProps = $props()
  const providedId = $props.id()

  const [useClipboardProps, localProps] = $derived(splitClipboardProps(props))

  const resolvedProps = $derived<UseClipboardProps>({
    ...useClipboardProps,
    id: useClipboardProps.id ?? providedId,
  })

  const clipboard = useClipboard(() => resolvedProps)
  const mergedProps = $derived(mergeProps(clipboard().getRootProps(), localProps))

  ClipboardProvider(() => clipboard())
</script>

<UI as="div" {...mergedProps} />
