import type { JSX } from 'solid-js'
import type { UseFloatingPanelProps } from '../hooks/use-floating-panel'
import type { UsePresenceProps } from '~/components/presence'
import { mergeProps } from '@destyler/solid'
import {
  PresenceProvider,
  splitPresenceProps,
  usePresence,
} from '~/components/presence'
import { createSplitProps } from '~/utils/create-split-props'
import { useFloatingPanel } from '../hooks/use-floating-panel'
import { FloatingPanelProvider } from '../hooks/use-floating-panel-context'

export interface FloatingPanelRootBaseProps extends UseFloatingPanelProps, UsePresenceProps {}
export interface FloatingPanelRootProps extends FloatingPanelRootBaseProps {
  children?: JSX.Element
}

export function FloatingPanelRoot(props: FloatingPanelRootProps) {
  const [presenceProps, floatingPanelProps] = splitPresenceProps(props)
  const [useFloatingPanelProps, localProps] = createSplitProps<UseFloatingPanelProps>()(
    floatingPanelProps,
    [
      'allowOverflow',
      'closeOnEscape',
      'defaultOpen',
      'disabled',
      'draggable',
      'getAnchorPosition',
      'getBoundaryEl',
      'gridSize',
      'id',
      'ids',
      'lockAspectRatio',
      'maxSize',
      'minSize',
      'onOpenChange',
      'onPositionChange',
      'onPositionChangeEnd',
      'onSizeChange',
      'onSizeChangeEnd',
      'onStageChange',
      'open',
      'persistRect',
      'position',
      'resizable',
      'size',
      'strategy',
    ],
  )
  const api = useFloatingPanel(useFloatingPanelProps)
  const presence = usePresence(mergeProps(() => ({ present: api().open }), presenceProps))

  return (
    <FloatingPanelProvider value={api}>
      <PresenceProvider value={presence}>{localProps.children}</PresenceProvider>
    </FloatingPanelProvider>
  )
}
