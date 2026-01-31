import type { UseClipboardReturn } from '../hooks/use-clipboard'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { ClipboardProvider } from '../hooks/use-clipboard-context'

interface RootProviderProps {
  value: UseClipboardReturn
}

export interface ClipboardRootProviderBaseProps extends RootProviderProps, PolymorphicProps {}
export interface ClipboardRootProviderProps extends HTMLProps<'div'>, ClipboardRootProviderBaseProps {}

export const ClipboardRootProvider = forwardRef<HTMLDivElement, ClipboardRootProviderProps>((props, ref) => {
  const [{ value: clipboard }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(clipboard.getRootProps(), localProps)

  return (
    <ClipboardProvider value={clipboard}>
      <ui.div ref={ref} {...mergedProps} />
    </ClipboardProvider>
  )
})

ClipboardRootProvider.displayName = 'ClipboardRootProvider'
