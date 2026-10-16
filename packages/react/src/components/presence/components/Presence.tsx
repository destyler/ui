import type { UsePresenceProps } from '../hooks/use-presence'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useComposedRefs } from '~/utils/compose-refs'
import { splitPresenceProps } from '../hooks/split-presence-props'
import { usePresence } from '../hooks/use-presence'

export interface PresenceBaseProps extends UsePresenceProps, PolymorphicProps {}
export interface PresenceProps extends HTMLProps<'div'>, PresenceBaseProps {}

export const Presence = forwardRef<HTMLDivElement, PresenceProps>((props, ref) => {
  const [presenceProps, localProps] = splitPresenceProps(props)
  const presence = usePresence(presenceProps)
  const composedRef = useComposedRefs(presence.ref, ref)

  if (presence.unmounted) {
    return null
  }

  return (
    <ui.div
      {...localProps}
      {...presence.getPresenceProps()}
      data-scope="presence"
      data-part="root"
      ref={composedRef}
    />
  )
})

Presence.displayName = 'Presence'
