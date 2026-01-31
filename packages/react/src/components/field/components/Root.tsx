import type { UseFieldProps } from '../hooks/use-field'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { createSplitProps } from '~/utils/create-split-props'
import { useField } from '../hooks/use-field'
import { FieldProvider } from '../hooks/use-field-context'

export interface FieldRootBaseProps extends UseFieldProps, PolymorphicProps {}
export interface FieldRootProps extends HTMLProps<'div'>, FieldRootBaseProps {}

export const FieldRoot = forwardRef<HTMLDivElement, FieldRootProps>((props, ref) => {
  const [useFieldProps, localProps] = createSplitProps<UseFieldProps>()(props, [
    'id',
    'ids',
    'disabled',
    'invalid',
    'readOnly',
    'required',
  ])
  const field = useField(useFieldProps)
  const mergedProps = mergeProps<HTMLProps<'div'>>(field.getRootProps(), localProps)

  return (
    <FieldProvider value={field}>
      <ui.div {...mergedProps} ref={composeRefs(ref, field.refs.rootRef)} />
    </FieldProvider>
  )
})

FieldRoot.displayName = 'FieldRoot'
