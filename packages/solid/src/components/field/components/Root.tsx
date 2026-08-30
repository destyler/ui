import type { UseFieldProps } from '../hooks/use-field'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useField } from '../hooks/use-field'
import { FieldProvider } from '../hooks/use-field-context'

export interface FieldRootBaseProps extends UseFieldProps, PolymorphicProps<'div'> {}
export interface FieldRootProps extends HTMLProps<'div'>, FieldRootBaseProps {}

export function FieldRoot(props: FieldRootProps) {
  const [useFieldProps, localProps] = createSplitProps<UseFieldProps>()(props, [
    'id',
    'ids',
    'disabled',
    'invalid',
    'readOnly',
    'required',
  ])
  const field = useField(useFieldProps)
  const mergedProps = mergeProps(() => field().getRootProps(), localProps)

  return (
    <FieldProvider value={field}>
      <ui.div {...mergedProps} />
    </FieldProvider>
  )
}
