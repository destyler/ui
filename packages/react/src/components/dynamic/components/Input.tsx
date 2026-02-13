import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useDynamicContext } from '../hooks/use-dynamic-context'

export interface DynamicInputBaseProps extends PolymorphicProps {}
export interface DynamicInputProps extends HTMLProps<'input'>, DynamicInputBaseProps {}

export const DynamicInput = forwardRef<HTMLInputElement, DynamicInputProps>((props, ref) => {
  const dynamic = useDynamicContext()
  const mergedProps = mergeProps(dynamic.getInputProps(), props)

  return <ui.input {...mergedProps} ref={ref} />
})

DynamicInput.displayName = 'DynamicInput'
