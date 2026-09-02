import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerContentBaseProps extends PolymorphicProps<'div'> {}
export interface ColorPickerContentProps extends HTMLProps<'div'>, ColorPickerContentBaseProps {}

export function ColorPickerContent(props: ColorPickerContentProps) {
  const api = useColorPickerContext()
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
