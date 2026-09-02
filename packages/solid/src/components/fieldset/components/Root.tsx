import type { UseFieldsetProps } from '../hooks/use-fieldset'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { createSplitProps } from '~/utils/create-split-props'
import { useFieldset } from '../hooks/use-fieldset'
import { FieldsetProvider } from '../hooks/use-fieldset-context'

export interface FieldsetRootBaseProps extends UseFieldsetProps, PolymorphicProps<'fieldset'> {}
export interface FieldsetRootProps extends HTMLProps<'fieldset'>, FieldsetRootBaseProps {}

export function FieldsetRoot(props: FieldsetRootProps) {
  const [useFieldsetProps, localProps] = createSplitProps<UseFieldsetProps>()(props, [
    'id',
    'disabled',
    'invalid',
  ])
  const fieldset = useFieldset(useFieldsetProps)
  const mergedProps = mergeProps(() => fieldset().getRootProps(), localProps)

  return (
    <FieldsetProvider value={fieldset}>
      <ui.fieldset {...mergedProps} ref={composeRefs(fieldset().setRootRef, localProps.ref)} />
    </FieldsetProvider>
  )
}

FieldsetRoot.displayName = 'FieldsetRoot'
