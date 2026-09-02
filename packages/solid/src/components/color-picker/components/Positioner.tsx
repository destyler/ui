import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerPositionerBaseProps extends PolymorphicProps<'div'> {}
export interface ColorPickerPositionerProps
  extends HTMLProps<'div'>,
  ColorPickerPositionerBaseProps {}

export function ColorPickerPositioner(props: ColorPickerPositionerProps) {
  const api = useColorPickerContext()
  const presenceApi = usePresenceContext()
  const mergedProps = mergeProps(() => api().getPositionerProps(), props)

  return (
    <Show when={!presenceApi().unmounted}>
      <ui.div {...mergedProps} />
    </Show>
  )
}
