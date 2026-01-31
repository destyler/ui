import type { UseFieldsetReturn } from '../hooks/use-fieldset'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { FieldsetProvider } from '../hooks/use-fieldset-context'

interface RootProviderProps {
  value: UseFieldsetReturn
}

export interface FieldsetRootProviderBaseProps extends RootProviderProps, PolymorphicProps {}
export interface FieldsetRootProviderProps extends HTMLProps<'fieldset'>, FieldsetRootProviderBaseProps {}

export const FieldsetRootProvider = forwardRef<HTMLFieldSetElement, FieldsetRootProviderProps>((props, ref) => {
  const [{ value: fieldset }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(fieldset.getRootProps(), localProps)

  return (
    <FieldsetProvider value={fieldset}>
      <ui.fieldset {...mergedProps} ref={ref} />
    </FieldsetProvider>
  )
})

FieldsetRootProvider.displayName = 'FieldsetRootProvider'
