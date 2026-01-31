import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/xstate'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useFieldContext } from '../hooks/use-field-context'

export interface FieldRequiredIndicatorBaseProps extends PolymorphicProps {
  fallback?: React.ReactNode
}
export interface FieldRequiredIndicatorProps extends HTMLProps<'span'>, FieldRequiredIndicatorBaseProps {}

export const FieldRequiredIndicator = forwardRef<HTMLSpanElement, FieldRequiredIndicatorProps>(
  ({ fallback, ...props }, ref) => {
    const field = useFieldContext()

    if (!field.required) {
      return fallback
    }

    const mergedProps = mergeProps(field.getRequiredIndicatorProps(), props)
    return (
      <ui.span {...mergedProps} ref={ref}>
        {props.children ?? '*'}
      </ui.span>
    )
  },
)

FieldRequiredIndicator.displayName = 'FieldRequiredIndicator'
