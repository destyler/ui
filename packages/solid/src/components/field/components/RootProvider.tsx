import type { UseFieldReturn } from '../hooks/use-field'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { createSplitProps } from '~/utils/create-split-props'
import { FieldProvider } from '../hooks/use-field-context'

interface RootProviderProps {
  value: UseFieldReturn
}

export interface FieldRootProviderBaseProps extends PolymorphicProps<'div'> {}
export interface FieldRootProviderProps
  extends HTMLProps<'div'>,
  RootProviderProps,
  FieldRootProviderBaseProps {}

export function FieldRootProvider(props: FieldRootProviderProps) {
  const [{ value: field }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(() => field().getRootProps(), localProps)

  return (
    <FieldProvider value={field}>
      <ui.div {...mergedProps} ref={composeRefs(field().setRootRef, localProps.ref)} />
    </FieldProvider>
  )
}
