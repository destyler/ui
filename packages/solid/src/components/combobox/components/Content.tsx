import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { useComboboxContext } from '../hooks/use-combobox-context'

export interface ComboboxContentBaseProps extends PolymorphicProps<'div'> {}
export interface ComboboxContentProps extends HTMLProps<'div'>, ComboboxContentBaseProps {}

export function ComboboxContent(props: ComboboxContentProps) {
  const api = useComboboxContext()
  const presenceApi = usePresenceContext()
  const mergedProps = mergeProps(
    () => api().getContentProps(),
    () => presenceApi().presenceProps,
    props,
  )

  return (
    <Show when={!presenceApi().unmounted}>
      <ui.div
        {...mergedProps}
        ref={composeRefs(presenceApi().presenceProps.ref, props.ref)}
      />
    </Show>
  )
}
