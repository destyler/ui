import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { useFieldContext } from '~/components/field'
import { ui } from '~/factory'
import { useDynamicContext } from '../hooks/use-dynamic-context'

export interface DynamicHiddenInputBaseProps extends PolymorphicProps {}
export interface DynamicHiddenInputProps extends HTMLProps<'input'>, DynamicHiddenInputBaseProps {}

export const DynamicHiddenInput = forwardRef<HTMLInputElement, DynamicHiddenInputProps>((props, ref) => {
  const dynamic = useDynamicContext()
  const mergedProps = mergeProps(dynamic.getHiddenInputProps(), props)
  const field = useFieldContext()

  return <ui.input aria-describedby={field?.ariaDescribedby} {...mergedProps} ref={ref} />
})

DynamicHiddenInput.displayName = 'DynamicHiddenInput'
