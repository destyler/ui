import type { UseEditReturn } from '../hooks/use-edit'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { EditProvider } from '../hooks/use-edit-context'

interface RootProviderProps {
  value: UseEditReturn
}

export interface EditRootProviderBaseProps extends PolymorphicProps<'div'> {}
export interface EditRootProviderProps
  extends HTMLProps<'div'>,
  RootProviderProps,
  EditRootProviderBaseProps {}

export function EditRootProvider(props: EditRootProviderProps) {
  const [{ value: edit }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(() => edit().getRootProps(), localProps)

  return (
    <EditProvider value={edit}>
      <ui.div {...mergedProps} />
    </EditProvider>
  )
}
