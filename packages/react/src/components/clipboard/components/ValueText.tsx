import type { HTMLProps, PolymorphicProps } from '~/factory'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useClipboardContext } from '../hooks/use-clipboard-context'

export interface ClipboardValueTextBaseProps extends PolymorphicProps {}
export interface ClipboardValueTextProps extends HTMLProps<'span'>, ClipboardValueTextBaseProps {}

export const ClipboardValueText = forwardRef<HTMLDivElement, ClipboardValueTextProps>((props, ref) => {
  const clipboard = useClipboardContext()
  return (
    <ui.span {...props} ref={ref}>
      {props.children || clipboard.value}
    </ui.span>
  )
})

ClipboardValueText.displayName = 'ClipboardValueText'
