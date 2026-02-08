import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useComboboxContext } from '../hooks/use-combobox-context'

export interface ComboboxPositionerBaseProps extends PolymorphicProps {}
export interface ComboboxPositionerProps extends HTMLProps<'div'>, ComboboxPositionerBaseProps {}

export const ComboboxPositioner = forwardRef<HTMLDivElement, ComboboxPositionerProps>((props, ref) => {
  const combobox = useComboboxContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(combobox.getPositionerProps(), props)

  if (presence.unmounted) {
    return null
  }

  return <ui.div {...mergedProps} ref={ref} />
})

ComboboxPositioner.displayName = 'ComboboxPositioner'
