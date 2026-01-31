import type { UseFieldReturn } from '../hooks/use-field'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { FieldProvider } from '../hooks/use-field-context'

interface RootProviderProps {
  value: UseFieldReturn
}

export interface FieldRootProviderBaseProps extends RootProviderProps, PolymorphicProps {}
export interface FieldRootProviderProps extends HTMLProps<'div'>, FieldRootProviderBaseProps {}

export const FieldRootProvider = forwardRef<HTMLDivElement, FieldRootProviderProps>((props, ref) => {
  const [{ value: field }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps<HTMLProps<'div'>>(field.getRootProps(), localProps)

  return (
    <FieldProvider value={field}>
      <ui.div {...mergedProps} ref={ref} />
    </FieldProvider>
  )
})

FieldRootProvider.displayName = 'FieldRootProvider'
