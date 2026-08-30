import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useColorPickerAreaPropsContext } from '../hooks/use-color-picker-area-props-context'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerAreaThumbBaseProps extends PolymorphicProps<'div'> {}
export interface ColorPickerAreaThumbProps
  extends HTMLProps<'div'>,
  ColorPickerAreaThumbBaseProps {}

export function ColorPickerAreaThumb(props: ColorPickerAreaThumbProps) {
  const api = useColorPickerContext()
  const areaProps = useColorPickerAreaPropsContext()
  const mergedProps = mergeProps(() => api().getAreaThumbProps(areaProps), props)

  return <ui.div {...mergedProps} />
}
