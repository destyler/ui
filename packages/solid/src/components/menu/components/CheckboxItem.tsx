import type { OptionItemProps } from '@destyler/menu'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { createMemo } from 'solid-js'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useMenuContext } from '../hooks/use-menu-context'
import { MenuItemProvider } from '../hooks/use-menu-item-context'
import { MenuOptionItemPropsProvider } from '../hooks/use-menu-option-item-props-context'

type PartialOptionItemProps = Omit<OptionItemProps, 'type'>

export interface MenuCheckboxItemBaseProps
  extends PartialOptionItemProps,
  PolymorphicProps<'div'> {}
export interface MenuCheckboxItemProps extends HTMLProps<'div'>, MenuCheckboxItemBaseProps {}

export function MenuCheckboxItem(props: MenuCheckboxItemProps) {
  const [partialOptionItemProps, localProps] = createSplitProps<PartialOptionItemProps>()(props, [
    'checked',
    'closeOnSelect',
    'disabled',
    'onCheckedChange',
    'value',
    'valueText',
  ])
  const optionItemProps = mergeProps(partialOptionItemProps, {
    type: 'checkbox',
  }) as OptionItemProps

  const context = useMenuContext()
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
