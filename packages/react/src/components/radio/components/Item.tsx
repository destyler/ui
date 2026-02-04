import type { ItemProps } from '@destyler/radio'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useRadioContext } from '../hooks/use-radio-context'
import { RadioItemProvider } from '../hooks/use-radio-item-context'
import { RadioItemPropsProvider } from '../hooks/use-radio-item-props-context'

export interface RadioItemBaseProps extends ItemProps, PolymorphicProps {}
export interface RadioItemProps extends HTMLProps<'label'>, RadioItemBaseProps {}

export const RadioItem = forwardRef<HTMLLabelElement, RadioItemProps>((props, ref) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['value', 'disabled', 'invalid'])
  const Radio = useRadioContext()
  const mergedProps = mergeProps(Radio.getItemProps(itemProps), localProps)
  const itemState = Radio.getItemState(itemProps)

  return (
    <RadioItemProvider value={itemState}>
      <RadioItemPropsProvider value={itemProps}>
        <ui.label {...mergedProps} ref={ref} />
      </RadioItemPropsProvider>
    </RadioItemProvider>
  )
})

RadioItem.displayName = 'RadioItem'
