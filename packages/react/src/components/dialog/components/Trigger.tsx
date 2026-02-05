import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useDialogContext } from '../hooks/use-dialog-context'

export interface DialogTriggerBaseProps extends PolymorphicProps {}
export interface DialogTriggerProps extends HTMLProps<'button'>, DialogTriggerBaseProps {}

export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>((props, ref) => {
  const dialog = useDialogContext()
  const presence = usePresenceContext()

  const mergedProps = mergeProps(
    {
      ...dialog.getTriggerProps(),
      'aria-controls': presence.unmounted ? undefined : dialog.getTriggerProps()['aria-controls'],
    },
    props,
  )

  return <ui.button {...mergedProps} ref={ref} />
})

DialogTrigger.displayName = 'DialogTrigger'
