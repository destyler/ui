import type { UseEditProps } from '../hooks/use-edit'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useEdit } from '../hooks/use-edit'
import { EditProvider } from '../hooks/use-edit-context'

export interface EditRootBaseProps extends UseEditProps, PolymorphicProps<'div'> {}
export interface EditRootProps extends HTMLProps<'div'>, EditRootBaseProps {}

export function EditRoot(props: EditRootProps) {
  const [useEditProps, localProps] = createSplitProps<UseEditProps>()(props, [
    'activationMode',
    'autoResize',
    'defaultEdit',
    'defaultValue',
    'disabled',
    'edit',
    'finalFocusEl',
    'form',
    'id',
    'ids',
    'invalid',
    'maxLength',
    'name',
    'onEditChange',
    'onFocusOutside',
    'onInteractOutside',
    'onPointerDownOutside',
    'onValueChange',
    'onValueCommit',
    'onValueRevert',
    'placeholder',
    'readOnly',
    'required',
    'selectOnFocus',
    'submitMode',
    'translations',
    'value',
  ])

  const api = useEdit(useEditProps)
  const mergedProps = mergeProps(() => api().getRootProps(), localProps)

  return (
    <EditProvider value={api}>
      <ui.div {...mergedProps} />
    </EditProvider>
  )
}
