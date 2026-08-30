import type { UseCheckboxReturn } from '../hooks/use-checkbox'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { CheckboxProvider } from '../hooks/use-checkbox-context'

interface RootProviderProps {
  value: UseCheckboxReturn
}

export interface CheckboxRootProviderBaseProps extends PolymorphicProps<'label'> {}
export interface CheckboxRootProviderProps
  extends HTMLProps<'label'>,
  RootProviderProps,
  CheckboxRootProviderBaseProps {}

export function CheckboxRootProvider(props: CheckboxRootProviderProps) {
  const [{ value: checkbox }, labelprops] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(() => checkbox().getRootProps(), labelprops)

  return (
    <CheckboxProvider value={checkbox}>
      <ui.label {...mergedProps} />
    </CheckboxProvider>
  )
}
