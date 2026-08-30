import type { HTMLProps, PolymorphicProps } from '~/factory'
import { autoresizeTextarea } from '@destyler/auto-resize'
import { mergeProps } from '@destyler/solid'
import { createEffect } from 'solid-js'
import { ui } from '~/factory'
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
  const { autoresize, ...textareaProps } = props

  const mergedProps = mergeProps(
    () => field?.().getTextareaProps(),
    () => ({ style: { resize: autoresize ? 'none' : undefined } }),
    textareaProps,
  )

  createEffect(() => {
    if (!autoresize)
      return
    const cleanup = autoresizeTextarea(textareaRef)
    return cleanup
  })

  return (
    <ui.textarea
      {...mergedProps}
      ref={(el) => {
        textareaRef = el
      }}
    />
  )
}
