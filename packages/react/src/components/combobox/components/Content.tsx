import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { useComboboxContext } from '../hooks/use-combobox-context'

export interface ComboboxContentBaseProps extends PolymorphicProps {}
export interface ComboboxContentProps extends HTMLProps<'div'>, ComboboxContentBaseProps {}

export const ComboboxContent = forwardRef<HTMLDivElement, ComboboxContentProps>((props, ref) => {
  const combobox = useComboboxContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(combobox.getContentProps(), presence.getPresenceProps(), props)

  if (presence.unmounted) {
    return null
  }

  return <ui.div {...mergedProps} ref={composeRefs(presence.ref, ref)} />
})

ComboboxContent.displayName = 'ComboboxContent'
