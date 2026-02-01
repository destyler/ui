import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useToggleContext } from '../hooks/use-toggle-context'

export interface ToggleIndicatorBaseProps extends PolymorphicProps {
  /**
   * The fallback content to render when the toggle is not pressed.
   */
  fallback?: React.ReactNode
}

export interface ToggleIndicatorProps extends HTMLProps<'div'>, ToggleIndicatorBaseProps {}

export const ToggleIndicator = forwardRef<HTMLDivElement, ToggleIndicatorProps>((props, ref) => {
  const { children, fallback, ...restProps } = props
  const toggle = useToggleContext()
  const mergedProps = mergeProps(toggle.getIndicatorProps(), restProps)
  return (
    <ui.div {...mergedProps} ref={ref}>
      {toggle.pressed ? children : fallback}
    </ui.div>
  )
})

ToggleIndicator.displayName = 'ToggleIndicator'
