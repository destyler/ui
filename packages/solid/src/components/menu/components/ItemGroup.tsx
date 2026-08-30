import type { ItemGroupProps } from '@destyler/menu'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Optional } from '~/types'
import { mergeProps } from '@destyler/solid'
import { createUniqueId } from 'solid-js'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useMenuContext } from '../hooks/use-menu-context'
import { MenuItemGroupProvider } from '../hooks/use-menu-item-group-context'

type OptionalItemGroupProps = Optional<ItemGroupProps, 'id'>

export interface MenuItemGroupBaseProps extends OptionalItemGroupProps, PolymorphicProps<'div'> {}
export interface MenuItemGroupProps extends HTMLProps<'div'>, MenuItemGroupBaseProps {}

export function MenuItemGroup(props: MenuItemGroupProps) {
  const [optionalItemGroupProps, localProps] = createSplitProps<OptionalItemGroupProps>()(props, [
    'id',
  ])
  const itemGroupProps = mergeProps({ id: createUniqueId() }, optionalItemGroupProps)
  const menu = useMenuContext()
  const mergedProps = mergeProps(() => menu().getItemGroupProps(itemGroupProps), localProps)

  return (
    <MenuItemGroupProvider value={itemGroupProps}>
      <ui.div {...mergedProps} />
    </MenuItemGroupProvider>
  )
}
