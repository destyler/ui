import type { HTMLProps, PolymorphicProps } from '~/factory'
import { autoresizeTextarea } from '@destyler/auto-resize'
import { mergeProps } from '@destyler/solid'
import { createEffect, onCleanup, splitProps } from 'solid-js'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { useFieldContext } from '../hooks/use-field-context'

export interface FieldTextareaBaseProps extends PolymorphicProps<'textarea'> {
  /**
   * Whether the textarea should autoresize
   * @default false
   */
  autoresize?: boolean
}
export interface FieldTextareaProps extends HTMLProps<'textarea'>, FieldTextareaBaseProps {}

export function FieldTextarea(props: FieldTextareaProps) {
  const field = useFieldContext()
  let textareaRef: HTMLTextAreaElement
  const [autoresizeProps, textareaProps] = splitProps(props, ['autoresize'])

  const mergedProps = mergeProps(
    () => field?.().getTextareaProps(),
    () => ({ style: { resize: autoresizeProps.autoresize ? 'none' : undefined } }),
    textareaProps,
  )

  createEffect(() => {
    if (!autoresizeProps.autoresize)
      return
    const cleanup = autoresizeTextarea(textareaRef)
    if (cleanup)
      onCleanup(cleanup)
  })

  return (
    <ui.textarea
      {...mergedProps}
      ref={composeRefs(
        (el) => {
          textareaRef = el
        },
        textareaProps.ref,
      )}
    />
  )
}
