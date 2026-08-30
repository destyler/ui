import type { SwatchTriggerProps } from '@destyler/color-picker'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerSwatchTriggerBaseProps
  extends SwatchTriggerProps,
  PolymorphicProps<'button'> {}
export interface ColorPickerSwatchTriggerProps
  extends Assign<HTMLProps<'button'>, ColorPickerSwatchTriggerBaseProps> {}

export function ColorPickerSwatchTrigger(props: ColorPickerSwatchTriggerProps) {
  const [triggerProps, localProps] = createSplitProps<SwatchTriggerProps>()(props, [
    'value',
    'disabled',
  ])
  const api = useColorPickerContext()
  const mergedProps = mergeProps(() => api().getSwatchTriggerProps(triggerProps), localProps)

  return <ui.button {...mergedProps} />
}
