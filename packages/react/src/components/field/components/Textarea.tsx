import type { HTMLProps, PolymorphicProps } from '~/factory'
import { autoresizeTextarea } from '@destyler/auto-resize'
import { mergeProps } from '@destyler/react'
import { forwardRef, useEffect, useRef } from 'react'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { useFieldContext } from '../hooks/use-field-context'

export interface FieldTextareaBaseProps extends PolymorphicProps {
  /**
   * Whether the textarea should autoresize
   * @default false
   */
  autoresize?: boolean
}
export interface FieldTextareaProps extends HTMLProps<'textarea'>, FieldTextareaBaseProps {}

export const FieldTextarea = forwardRef<HTMLTextAreaElement, FieldTextareaProps>((props, ref) => {
  const { autoresize, ...textareaProps } = props
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const field = useFieldContext()
  const mergedProps = mergeProps<HTMLProps<'textarea'>>(
    field?.getTextareaProps(),
    { style: { resize: autoresize ? 'none' : undefined } },
    textareaProps,
  )

  useEffect(() => {
    if (!autoresize)
      return
    return autoresizeTextarea(textareaRef.current)
  }, [autoresize])

  return <ui.textarea {...mergedProps} ref={composeRefs(ref, textareaRef)} />
})

FieldTextarea.displayName = 'FieldTextarea'
