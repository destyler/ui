import type { TransparencyGridProps } from '@destyler/color-picker'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useColorPickerContext } from '../hooks/use-color-picker-context'

export interface ColorPickerTransparencyGridBaseProps extends TransparencyGridProps, PolymorphicProps {}
export interface ColorPickerTransparencyGridProps extends HTMLProps<'div'>, ColorPickerTransparencyGridBaseProps {}

export const ColorPickerTransparencyGrid = forwardRef<HTMLDivElement, ColorPickerTransparencyGridProps>(
  (props, ref) => {
    const [gridProps, localProps] = createSplitProps<TransparencyGridProps>()(props, ['size'])
    const colorPicker = useColorPickerContext()
    const mergedProps = mergeProps(colorPicker.getTransparencyGridProps(gridProps), localProps)

    return <ui.div {...mergedProps} ref={ref} />
  },
)

ColorPickerTransparencyGrid.displayName = 'ColorPickerTransparencyGrid'
