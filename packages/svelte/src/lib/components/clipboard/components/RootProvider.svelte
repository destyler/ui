<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { UseClipboardReturn } from '../hooks/use-clipboard.svelte'

  export interface ClipboardRootProviderBaseProps extends PolymorphicProps<'div'> {
    value: UseClipboardReturn
  }
  export interface ClipboardRootProviderProps extends Assign<HTMLProps<'div'>, ClipboardRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { ClipboardProvider } from '../hooks/use-clipboard-context'

  const { value, ...props }: ClipboardRootProviderProps = $props()

  const mergedProps = $derived(mergeProps(value().getRootProps(), props))

  ClipboardProvider(() => value())
</script>

<UI as="div" {...mergedProps} />
