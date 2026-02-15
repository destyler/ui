import type { UseFloatingPanelReturn } from '../hooks/use-floating-panel'
import type { UsePresenceProps } from '~/components/presence'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { PresenceProvider, splitPresenceProps, usePresence } from '~/components/presence'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { FloatingPanelProvider } from '../hooks/use-floating-panel-context'

interface RootProviderProps {
  value: UseFloatingPanelReturn
}

export interface FloatingPanelRootProviderBaseProps extends RootProviderProps, UsePresenceProps, PolymorphicProps {}
export interface FloatingPanelRootProviderProps extends HTMLProps<'div'>, FloatingPanelRootProviderBaseProps {}

export const FloatingPanelRootProvider = forwardRef<HTMLDivElement, FloatingPanelRootProviderProps>((props, ref) => {
  const [presenceProps, floatingPanelProps] = splitPresenceProps(props)
  const [{ value: floatingPanel }, localProps] = createSplitProps<RootProviderProps>()(floatingPanelProps, ['value'])
  const presence = usePresence(mergeProps({ present: floatingPanel.open }, presenceProps))

  return (
    <FloatingPanelProvider value={floatingPanel}>
      <PresenceProvider value={presence}>
        <ui.div {...localProps} ref={ref} />
      </PresenceProvider>
    </FloatingPanelProvider>
  )
})

FloatingPanelRootProvider.displayName = 'FloatingPanelRootProvider'
