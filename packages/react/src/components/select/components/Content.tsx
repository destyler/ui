import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { useSelectContext } from '../hooks/use-select-context'

export interface SelectContentBaseProps extends PolymorphicProps {}
export interface SelectContentProps extends HTMLProps<'div'>, SelectContentBaseProps {}

export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>((props, ref) => {
  const select = useSelectContext()
  const presence = usePresenceContext()
  const mergedProps = mergeProps(select.getContentProps(), presence.getPresenceProps(), props)

  if (presence.unmounted) {
    return null
  }

  return <ui.div {...mergedProps} ref={composeRefs(presence.ref, ref)} />
})

SelectContent.displayName = 'SelectContent'
