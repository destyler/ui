import type { ReactNode } from 'react'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useClipboardContext } from '../hooks/use-clipboard-context'

export interface ClipboardIndicatorBaseProps extends PolymorphicProps {
  copied?: ReactNode
}
export interface ClipboardIndicatorProps extends HTMLProps<'div'>, ClipboardIndicatorBaseProps {}

export const ClipboardIndicator = forwardRef<HTMLDivElement, ClipboardIndicatorProps>((props, ref) => {
  const { children, copied, ...localProps } = props
  const clipboard = useClipboardContext()
  const mergedProps = mergeProps(clipboard.getIndicatorProps({ copied: clipboard.copied }), localProps)

  return (
    <ui.div {...mergedProps} ref={ref}>
      {clipboard.copied ? copied : children}
    </ui.div>
  )
})

ClipboardIndicator.displayName = 'ClipboardIndicator'
