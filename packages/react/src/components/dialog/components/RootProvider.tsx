import type { UseDialogReturn } from '../hooks/use-dialog'
import type { UsePresenceProps } from '~/components/presence'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { RenderStrategyProps } from '~/utils/render-strategy'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { PresenceProvider, splitPresenceProps, usePresence } from '~/components/presence'
import { ui } from '~/factory'
import {

  RenderStrategyPropsProvider,
  splitRenderStrategyProps,
} from '~/utils/render-strategy'
import { DialogProvider } from '../hooks/use-dialog-context'

interface RootProviderProps {
  value: UseDialogReturn
}

export interface DialogRootProviderBaseProps extends RootProviderProps, UsePresenceProps, RenderStrategyProps, PolymorphicProps {}
export interface DialogRootProviderProps extends HTMLProps<'div'>, DialogRootProviderBaseProps {}

export const DialogRootProvider = forwardRef<HTMLDivElement, DialogRootProviderProps>((props, ref) => {
  const [renderStrategyProps, localProps] = splitRenderStrategyProps(props)
  const [presenceProps, { value: dialog, ...restProps }] = splitPresenceProps(localProps)
  const presence = usePresence(mergeProps({ present: dialog.open }, presenceProps))

  return (
    <DialogProvider value={dialog}>
      <PresenceProvider value={presence}>
        <RenderStrategyPropsProvider value={renderStrategyProps}>
          <ui.div ref={ref} {...restProps} />
        </RenderStrategyPropsProvider>
      </PresenceProvider>
    </DialogProvider>
  )
})

DialogRootProvider.displayName = 'DialogRootProvider'
