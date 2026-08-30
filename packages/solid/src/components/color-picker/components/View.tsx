import type { ColorFormat } from '@destyler/color-picker'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { Show } from 'solid-js'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { colorPickerAnatomy } from '../anatomy'
import { useColorPickerContext } from '../hooks/use-color-picker-context'
import { ColorPickerFormatPropsProvider } from '../hooks/use-color-picker-format-context'

interface FormatOptions {
  format: ColorFormat
}

export interface ColorPickerViewBaseProps extends FormatOptions, PolymorphicProps<'div'> {}
export interface ColorPickerViewProps extends HTMLProps<'div'>, ColorPickerViewBaseProps {}

export function ColorPickerView(props: ColorPickerViewProps) {
  const api = useColorPickerContext()
  const [formatProps, localProps] = createSplitProps<FormatOptions>()(props, ['format'])
  const mergedProps = mergeProps(() => colorPickerAnatomy.build().view.attrs, localProps)

  return (
    <ColorPickerFormatPropsProvider value={formatProps}>
      <Show when={api().format === props.format}>
        <ui.div data-format={props.format} {...mergedProps} />
      </Show>
    </ColorPickerFormatPropsProvider>
  )
}
