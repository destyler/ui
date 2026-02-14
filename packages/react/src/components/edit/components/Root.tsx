import type { UseEditProps } from '../hooks/use-edit'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useEdit } from '../hooks/use-edit'
import { EditProvider } from '../hooks/use-edit-context'

export interface EditRootBaseProps extends UseEditProps, PolymorphicProps {}
export interface EditRootProps extends Assign<HTMLProps<'div'>, EditRootBaseProps> {}

export const EditRoot = forwardRef<HTMLDivElement, EditRootProps>((props, ref) => {
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
  const editable = useEdit(useEditProps)
  const mergedProps = mergeProps(editable.getRootProps(), localProps)

  return (
    <EditProvider value={editable}>
      <ui.div {...mergedProps} ref={ref} />
    </EditProvider>
  )
})

EditRoot.displayName = 'EditRoot'
