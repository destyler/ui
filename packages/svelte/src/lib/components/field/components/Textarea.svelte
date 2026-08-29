<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface FieldTextareaBaseProps extends PolymorphicProps<'textarea'> {
    /**
     * Whether the textarea should autoresize
     * @default false
     */
    autoresize?: boolean
  }
  export interface FieldTextareaProps extends Assign<HTMLProps<'textarea'>, FieldTextareaBaseProps> {}
</script>

<script lang="ts">
  import { autoresizeTextarea } from '@destyler/auto-resize'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useFieldContext } from '../hooks/use-field-context'

  let textareaRef = $state<HTMLTextAreaElement | null>(null)

  const { autoresize, ...props }: FieldTextareaProps = $props()

  const field = useFieldContext()
  const mergedProps = $derived(
    mergeProps(field?.().getTextareaProps() ?? {}, { style: { resize: autoresize ? 'none' : undefined } }, props),
  )

  $effect(() => {
    if (!autoresize) return
    return autoresizeTextarea(textareaRef)
  })
</script>

<UI as="textarea" {...mergedProps} bind:ref={textareaRef} />
