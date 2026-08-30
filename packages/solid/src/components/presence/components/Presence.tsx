import type { UsePresenceProps } from '../hooks/use-presence'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { splitPresenceProps } from '../hooks/split-presence-props'
import { usePresence } from '../hooks/use-presence'

export interface PresenceBaseProps extends UsePresenceProps, PolymorphicProps<'div'> {}
export interface PresenceProps extends HTMLProps<'div'>, PresenceBaseProps {}

export function Presence(props: PresenceProps) {
  const [presenceProps, localProps] = splitPresenceProps(props)
  const api = usePresence(presenceProps)
  const mergedProps = mergeProps(() => api().presenceProps, localProps)

  return (
    <Show when={!api().unmounted}>
      <ui.div
        {...mergedProps}
        ref={composeRefs(api().presenceProps.ref, localProps.ref)}
        data-scope="presence"
        data-part="root"
      />
    </Show>
  )
}
