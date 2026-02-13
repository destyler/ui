import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useDynamicContext } from '../hooks/use-dynamic-context'
import { useDynamicItemPropsContext } from '../hooks/use-dynamic-item-props-context'

export interface DynamicItemInputBaseProps extends PolymorphicProps {}
export interface DynamicItemInputProps extends HTMLProps<'input'>, DynamicItemInputBaseProps {}

export const DynamicItemInput = forwardRef<HTMLInputElement, DynamicItemInputProps>((props, ref) => {
  const dynamic = useDynamicContext()
  const itemProps = useDynamicItemPropsContext()
  const mergedProps = mergeProps(dynamic.getItemInputProps(itemProps), props)

  return <ui.input {...mergedProps} ref={ref} />
})

DynamicItemInput.displayName = 'DynamicItemInput'
