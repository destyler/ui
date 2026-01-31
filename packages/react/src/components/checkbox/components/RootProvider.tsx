import type { UseCheckboxReturn } from '../hooks/use-checkbox'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { CheckboxProvider } from '../hooks/use-checkbox-context'

interface RootProviderProps {
  value: UseCheckboxReturn
}

export interface CheckboxRootProviderBaseProps extends RootProviderProps, PolymorphicProps {}
export interface CheckboxRootProviderProps extends HTMLProps<'label'>, CheckboxRootProviderBaseProps {}

export const CheckboxRootProvider = forwardRef<HTMLLabelElement, CheckboxRootProviderProps>((props, ref) => {
  const [{ value: checkbox }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(checkbox.getRootProps(), localProps)

  return (
    <CheckboxProvider value={checkbox}>
      <ui.label {...mergedProps} ref={ref} />
    </CheckboxProvider>
  )
})

CheckboxRootProvider.displayName = 'CheckboxRootProvider'
