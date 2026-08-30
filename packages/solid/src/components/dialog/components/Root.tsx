import type { JSX } from 'solid-js'
import type { UseDialogProps } from '../hooks/use-dialog'
import type { UsePresenceProps } from '~/components/presence'
import { mergeProps } from '@destyler/solid'
import {
  PresenceProvider,
  splitPresenceProps,
  usePresence,

} from '~/components/presence'
import { createSplitProps } from '~/utils/create-split-props'
import { RenderStrategyProvider, splitRenderStrategyProps } from '~/utils/render-strategy'
import { useDialog } from '../hooks/use-dialog'
import { DialogProvider } from '../hooks/use-dialog-context'

export interface DialogRootBaseProps extends UseDialogProps, UsePresenceProps {}
export interface DialogRootProps extends DialogRootBaseProps {
  children?: JSX.Element
}

export function DialogRoot(props: DialogRootProps) {
  const [presenceProps, dialogProps] = splitPresenceProps(props)
  const [renderStrategyProps] = splitRenderStrategyProps(presenceProps)
  const [useDialogProps, localProps] = createSplitProps<UseDialogProps>()(dialogProps, [
    'aria-label',
    'closeOnEscape',
    'closeOnInteractOutside',
    'defaultOpen',
    'finalFocusEl',
    'id',
    'ids',
    'initialFocusEl',
    'modal',
    'onEscapeKeyDown',
    'onFocusOutside',
    'onInteractOutside',
    'onOpenChange',
    'onPointerDownOutside',
    'open',
    'persistentElements',
    'preventScroll',
    'restoreFocus',
    'role',
    'trapFocus',
  ])

  const api = useDialog(useDialogProps)
  const apiPresence = usePresence(mergeProps(presenceProps, () => ({ present: api().open })))

  return (
    <DialogProvider value={api}>
      <RenderStrategyProvider value={renderStrategyProps}>
        <PresenceProvider value={apiPresence}>{localProps.children}</PresenceProvider>
      </RenderStrategyProvider>
    </DialogProvider>
  )
}
