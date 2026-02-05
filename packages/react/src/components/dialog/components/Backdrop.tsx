import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresence } from '~/components/presence'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { useRenderStrategyPropsContext } from '~/utils/render-strategy'
import { useDialogContext } from '../hooks/use-dialog-context'

export interface DialogBackdropBaseProps extends PolymorphicProps {}
export interface DialogBackdropProps extends HTMLProps<'div'>, DialogBackdropBaseProps {}

export const DialogBackdrop = forwardRef<HTMLDivElement, DialogBackdropProps>((props, ref) => {
  const dialog = useDialogContext()
  const renderStrategyProps = useRenderStrategyPropsContext()
  const presence = usePresence({ ...renderStrategyProps, present: dialog.open })
  const mergedProps = mergeProps(dialog.getBackdropProps(), props)

  if (presence.unmounted) {
    return null
  }

  return <ui.div {...mergedProps} ref={composeRefs(presence.ref, ref)} />
})

DialogBackdrop.displayName = 'DialogBackdrop'
