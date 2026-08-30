import type { ItemProps } from '@destyler/radio'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { createMemo } from 'solid-js'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useRadioContext } from '../hooks/use-radio-context'
import { RadioItemProvider } from '../hooks/use-radio-item-context'
import { RadioItemPropsProvider } from '../hooks/use-radio-item-props-context'

export interface RadioItemBaseProps extends ItemProps, PolymorphicProps<'label'> {}
export interface RadioItemProps extends HTMLProps<'label'>, RadioItemBaseProps {}

export function RadioItem(props: RadioItemProps) {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, [
    'value',
    'disabled',
    'invalid',
  ])
  const radio = useRadioContext()
  const mergedProps = mergeProps(() => radio().getItemProps(itemProps), localProps)
  const itemState = createMemo(() => radio().getItemState(itemProps))

  return (
    <RadioItemPropsProvider value={itemProps}>
      <RadioItemProvider value={itemState}>
        <ui.label {...mergedProps} />
      </RadioItemProvider>
    </RadioItemPropsProvider>
  )
}
