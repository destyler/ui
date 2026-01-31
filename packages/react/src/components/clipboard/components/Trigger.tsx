import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useClipboardContext } from '../hooks/use-clipboard-context'

export interface ClipboardTriggerBaseProps extends PolymorphicProps {}
export interface ClipboardTriggerProps extends HTMLProps<'button'>, ClipboardTriggerBaseProps {}

export const ClipboardTrigger = forwardRef<HTMLButtonElement, ClipboardTriggerProps>((props, ref) => {
  const clipboard = useClipboardContext()
  const mergedProps = mergeProps(clipboard.getTriggerProps(), props)

  return <ui.button {...mergedProps} ref={ref} />
})

ClipboardTrigger.displayName = 'ClipboardTrigger'
