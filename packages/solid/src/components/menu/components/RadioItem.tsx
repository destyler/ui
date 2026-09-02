import type { OptionItemProps } from '@destyler/menu'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { createMemo } from 'solid-js'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useMenuContext } from '../hooks/use-menu-context'
import { MenuItemProvider } from '../hooks/use-menu-item-context'
import { useMenuItemGroupContext } from '../hooks/use-menu-item-group-context'
import { MenuOptionItemPropsProvider } from '../hooks/use-menu-option-item-props-context'

type PartialOptionItemProps = Omit<OptionItemProps, 'type' | 'checked' | 'onCheckedChange'>

export interface MenuRadioItemBaseProps extends PartialOptionItemProps, PolymorphicProps<'div'> {}
export interface MenuRadioItemProps extends HTMLProps<'div'>, MenuRadioItemBaseProps {}

export function MenuRadioItem(props: MenuRadioItemProps) {
  const [partialItemProps, localProps] = createSplitProps<PartialOptionItemProps>()(props, [
    'closeOnSelect',
    'disabled',
    'value',
    'valueText',
  ])
  const context = useMenuContext()
  const itemGroup = useMenuItemGroupContext()
  const optionItemProps = mergeProps(partialItemProps, () => ({
    type: 'radio',
    checked: itemGroup.value === partialItemProps.value,
    onCheckedChange: () => itemGroup.onValueChange?.({ value: partialItemProps.value }),
  })) as OptionItemProps

  const mergedProps = mergeProps(() => context().getOptionItemProps(optionItemProps), localProps)
  const optionItemState = createMemo(() => context().getOptionItemState(optionItemProps))

  return (
    <MenuOptionItemPropsProvider value={optionItemProps}>
      <MenuItemProvider value={optionItemState}>
        <ui.div {...mergedProps} />
      </MenuItemProvider>
    </MenuOptionItemPropsProvider>
  )
}
