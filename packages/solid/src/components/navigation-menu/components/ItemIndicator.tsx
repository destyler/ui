import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { splitProps } from 'solid-js'
import { ui } from '~/factory'

export interface NavigationMenuItemIndicatorBaseProps extends PolymorphicProps<'span'> {
  value: string
}
export interface NavigationMenuItemIndicatorProps
  extends Assign<HTMLProps<'span'>, NavigationMenuItemIndicatorBaseProps> {}

export function NavigationMenuItemIndicator(props: NavigationMenuItemIndicatorProps) {
  const [, localProps] = splitProps(props, ['value'])

  return (
    <ui.span
      data-scope="navigation-menu"
      data-part="item-indicator"
      {...localProps}
    />
  )
}
