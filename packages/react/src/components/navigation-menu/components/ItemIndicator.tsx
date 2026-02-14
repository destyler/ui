import type { HTMLProps, PolymorphicProps } from '~/factory'
import { forwardRef } from 'react'
import { ui } from '~/factory'

export interface NavigationMenuItemIndicatorBaseProps extends PolymorphicProps {
  value: string
}
export interface NavigationMenuItemIndicatorProps extends HTMLProps<'span'>, NavigationMenuItemIndicatorBaseProps {}

export const NavigationMenuItemIndicator = forwardRef<HTMLSpanElement, NavigationMenuItemIndicatorProps>((props, ref) => {
  const { value, ...restProps } = props

  return (
    <ui.span
      data-scope="navigation-menu"
      data-part="item-indicator"
      {...restProps}
      ref={ref}
    />
  )
})

NavigationMenuItemIndicator.displayName = 'NavigationMenuItemIndicator'
