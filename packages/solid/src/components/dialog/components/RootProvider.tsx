import type { JSX } from 'solid-js'
import type { UseDialogReturn } from '../hooks/use-dialog'
import type { UsePresenceProps } from '~/components/presence'
import { mergeProps } from '@destyler/solid'
import {
  PresenceProvider,
  splitPresenceProps,
  usePresence,

} from '~/components/presence'
import { RenderStrategyProvider, splitRenderStrategyProps } from '~/utils/render-strategy'
import { DialogProvider } from '../hooks/use-dialog-context'

interface RootProviderProps {
  value: UseDialogReturn
}

export interface DialogRootProviderBaseProps extends RootProviderProps, UsePresenceProps {}
export interface DialogRootProviderProps extends DialogRootProviderBaseProps {
  children?: JSX.Element
}

export function DialogRootProvider(props: DialogRootProviderProps) {
  const [presenceProps, dialogProps] = splitPresenceProps(props)
  const [renderStrategyProps] = splitRenderStrategyProps(presenceProps)

  const apiPresence = usePresence(
    mergeProps(presenceProps, () => ({ present: dialogProps.value().open })),
  )

  return (
    <DialogProvider value={dialogProps.value}>
      <RenderStrategyProvider value={renderStrategyProps}>
        <PresenceProvider value={apiPresence}>{dialogProps.children}</PresenceProvider>
      </RenderStrategyProvider>
    </DialogProvider>
  )
}
