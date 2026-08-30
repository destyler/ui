import type { UseFieldsetReturn } from '../hooks/use-fieldset'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { createSplitProps } from '~/utils/create-split-props'
import { FieldsetProvider } from '../hooks/use-fieldset-context'

interface RootProviderProps {
  value: UseFieldsetReturn
}

export interface FieldsetRootProviderBaseProps
  extends RootProviderProps,
  PolymorphicProps<'fieldset'> {}
export interface FieldsetRootProviderProps
  extends HTMLProps<'fieldset'>,
  FieldsetRootProviderBaseProps {}

export function FieldsetRootProvider(props: FieldsetRootProviderProps) {
  const [{ value: fieldset }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(() => fieldset().getRootProps(), localProps)

  return (
    <FieldsetProvider value={fieldset}>
      <ui.fieldset {...mergedProps} ref={composeRefs(fieldset().setRootRef, localProps.ref)} />
    </FieldsetProvider>
  )
}
