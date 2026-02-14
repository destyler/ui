import type { UseEditReturn } from '../hooks/use-edit'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { EditProvider } from '../hooks/use-edit-context'

interface RootProviderProps {
  value: UseEditReturn
}

export interface EditRootProviderBaseProps extends RootProviderProps, PolymorphicProps {}
export interface EditRootProviderProps extends HTMLProps<'div'>, EditRootProviderBaseProps {}

export const EditRootProvider = forwardRef<HTMLDivElement, EditRootProviderProps>((props, ref) => {
  const [{ value: editable }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(editable.getRootProps(), localProps)

  return (
    <EditProvider value={editable}>
      <ui.div {...mergedProps} ref={ref} />
    </EditProvider>
  )
})

EditRootProvider.displayName = 'EditRootProvider'
