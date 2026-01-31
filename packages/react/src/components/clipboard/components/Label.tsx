import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useClipboardContext } from '../hooks/use-clipboard-context'

export interface ClipboardLabelBaseProps extends PolymorphicProps {}
export interface ClipboardLabelProps extends HTMLProps<'label'>, ClipboardLabelBaseProps {}

export const ClipboardLabel = forwardRef<HTMLLabelElement, ClipboardLabelProps>((props, ref) => {
  const clipboard = useClipboardContext()
  const mergedProps = mergeProps(clipboard.getLabelProps(), props)

  return <ui.label {...mergedProps} ref={ref} />
})

ClipboardLabel.displayName = 'ClipboardLabel'
