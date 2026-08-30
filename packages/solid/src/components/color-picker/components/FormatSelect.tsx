import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Index } from 'solid-js'
import { ui } from '~/factory'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerFormatSelectBaseProps extends PolymorphicProps<'select'> {}
export interface ColorPickerFormatSelectProps
  extends HTMLProps<'select'>,
  ColorPickerFormatSelectBaseProps {}

export function ColorPickerFormatSelect(props: ColorPickerFormatSelectProps) {
  const api = useColorPickerContext()
  const mergedProps = mergeProps(() => api().getFormatSelectProps(), props)

  return (
    <ui.select {...mergedProps}>
      <Index each={['rgba', 'hsla', 'hsba']}>
        {format => <ui.option value={format()}>{format()}</ui.option>}
      </Index>
    </ui.select>
  )
}
