import type { UseFloatingPanelProps } from '../hooks/use-floating-panel'
import type { UsePresenceProps } from '~/components/presence'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { PresenceProvider, splitPresenceProps, usePresence } from '~/components/presence'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useFloatingPanel } from '../hooks/use-floating-panel'
import { FloatingPanelProvider } from '../hooks/use-floating-panel-context'

export interface FloatingPanelRootBaseProps extends UseFloatingPanelProps, UsePresenceProps, PolymorphicProps {}
export interface FloatingPanelRootProps extends Assign<HTMLProps<'div'>, FloatingPanelRootBaseProps> {}

export const FloatingPanelRoot = forwardRef<HTMLDivElement, FloatingPanelRootProps>((props, ref) => {
  const [presenceProps, floatingPanelProps] = splitPresenceProps(props)
  const [useFloatingPanelProps, localProps] = createSplitProps<UseFloatingPanelProps>()(floatingPanelProps, [
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
  ])
  const floatingPanel = useFloatingPanel(useFloatingPanelProps)
  const presence = usePresence(mergeProps({ present: floatingPanel.open }, presenceProps))

  return (
    <FloatingPanelProvider value={floatingPanel}>
      <PresenceProvider value={presence}>
        <ui.div {...localProps} ref={ref} />
      </PresenceProvider>
    </FloatingPanelProvider>
  )
})

FloatingPanelRoot.displayName = 'FloatingPanelRoot'
