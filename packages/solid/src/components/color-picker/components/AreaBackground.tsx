import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useColorPickerAreaPropsContext } from '../hooks/use-color-picker-area-props-context'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerAreaBackgroundBaseProps extends PolymorphicProps<'div'> {}
export interface ColorPickerAreaBackgroundProps
  extends HTMLProps<'div'>,
  ColorPickerAreaBackgroundBaseProps {}

export function ColorPickerAreaBackground(props: ColorPickerAreaBackgroundProps) {
  const api = useColorPickerContext()
  const areaProps = useColorPickerAreaPropsContext()
  const mergedProps = mergeProps(() => api().getAreaBackgroundProps(areaProps), props)

  return <ui.div {...mergedProps} />
}
