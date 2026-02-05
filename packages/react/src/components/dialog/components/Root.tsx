import type { UseDialogProps } from '../hooks/use-dialog'
import type { UsePresenceProps } from '~/components/presence'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import type { RenderStrategyProps } from '~/utils/render-strategy'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { PresenceProvider, splitPresenceProps, usePresence } from '~/components/presence'
import { ui } from '~/factory'
import {
  RenderStrategyPropsProvider,
  splitRenderStrategyProps,
} from '~/utils/render-strategy'
import { splitDialogProps } from '../hooks/split-dialog-props'
import { useDialog } from '../hooks/use-dialog'
import { DialogProvider } from '../hooks/use-dialog-context'

export interface DialogRootBaseProps extends UseDialogProps, UsePresenceProps, RenderStrategyProps, PolymorphicProps {}
export interface DialogRootProps extends Assign<HTMLProps<'div'>, DialogRootBaseProps> {}

export const DialogRoot = forwardRef<HTMLDivElement, DialogRootProps>((props, ref) => {
  const [renderStrategyProps, localProps] = splitRenderStrategyProps(props)
  const [presenceProps, otherProps] = splitPresenceProps(localProps)
  const [useDialogProps, restProps] = splitDialogProps(otherProps)
  const dialog = useDialog(useDialogProps)
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

DialogRoot.displayName = 'DialogRoot'
