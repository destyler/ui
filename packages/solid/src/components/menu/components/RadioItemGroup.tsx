import type { UseMenuItemGroupContext } from '../hooks/use-menu-item-group-context'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Optional } from '~/types'
import { mergeProps } from '@destyler/solid'
import { createUniqueId } from 'solid-js'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useMenuContext } from '../hooks/use-menu-context'
import { MenuItemGroupProvider } from '../hooks/use-menu-item-group-context'

type OptionalUseMenuItemGroupContext = Optional<UseMenuItemGroupContext, 'id'>

export interface MenuRadioItemGroupBaseProps
  extends OptionalUseMenuItemGroupContext,
  PolymorphicProps<'div'> {}
export interface MenuRadioItemGroupProps extends HTMLProps<'div'>, MenuRadioItemGroupBaseProps {}

export function MenuRadioItemGroup(props: MenuRadioItemGroupProps) {
  const [optionalItemGroupProps, localProps] = createSplitProps<OptionalUseMenuItemGroupContext>()(
    props,
    ['id', 'onValueChange', 'value'],
  )
  const context = useMenuContext()
  const itemGroupProps = mergeProps({ id: createUniqueId() }, optionalItemGroupProps)
  const mergedProps = mergeProps(() => context().getItemGroupProps(itemGroupProps), localProps)

  return (
    <MenuItemGroupProvider value={itemGroupProps}>
      <ui.div {...mergedProps} />
    </MenuItemGroupProvider>
  )
}
