import type { JSX } from 'solid-js'
import type { UseFloatingPanelReturn } from '../hooks/use-floating-panel'
import type { UsePresenceProps } from '~/components/presence'
import { mergeProps } from '@destyler/solid'
import {
  PresenceProvider,
  splitPresenceProps,
  usePresence,

} from '~/components/presence'
import { FloatingPanelProvider } from '../hooks/use-floating-panel-context'

interface RootProviderProps {
  value: UseFloatingPanelReturn
}

export interface FloatingPanelRootProviderBaseProps
  extends RootProviderProps,
  UsePresenceProps {}
export interface FloatingPanelRootProviderProps extends FloatingPanelRootProviderBaseProps {
  children?: JSX.Element
}

export function FloatingPanelRootProvider(props: FloatingPanelRootProviderProps) {
  const [presenceProps, floatingPanelProps] = splitPresenceProps(props)
  const floatingPanel: UseFloatingPanelReturn = () => floatingPanelProps.value()
  const presence = usePresence(
    mergeProps(() => ({ present: floatingPanel().open }), presenceProps),
  )

  return (
    <FloatingPanelProvider value={floatingPanel}>
      <PresenceProvider value={presence}>{floatingPanelProps.children}</PresenceProvider>
    </FloatingPanelProvider>
  )
}
