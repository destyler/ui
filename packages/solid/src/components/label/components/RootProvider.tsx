import type { UseLabelReturn } from '../hooks/use-label'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { LabelProvider } from '../hooks/use-label-context'

interface RootProviderProps {
  value: UseLabelReturn
}

export interface LabelRootProviderBaseProps
  extends RootProviderProps,
  PolymorphicProps<'label'> {}
export interface LabelRootProviderProps extends HTMLProps<'label'>, LabelRootProviderBaseProps {}

export function LabelRootProvider(props: LabelRootProviderProps) {
  const [providerProps, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const label = () => providerProps.value()
  const mergedProps = mergeProps(() => label().getRootProps(), localProps)

  return (
    <LabelProvider value={label}>
      <ui.label {...mergedProps} />
    </LabelProvider>
  )
}
