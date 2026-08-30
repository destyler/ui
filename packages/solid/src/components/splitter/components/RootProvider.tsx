import type { UseSplitterReturn } from '../hooks/use-splitter'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { SplitterProvider } from '../hooks/use-splitter-context'

interface RootProviderProps {
  value: UseSplitterReturn
}

export interface SplitterRootProviderBaseProps extends PolymorphicProps<'div'> {}
export interface SplitterRootProviderProps
  extends HTMLProps<'div'>,
  RootProviderProps,
  SplitterRootProviderBaseProps {}

export function SplitterRootProvider(props: SplitterRootProviderProps) {
  const [providerProps, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const splitter = () => providerProps.value()
  const mergedProps = mergeProps(() => splitter().getRootProps(), localProps)

  return (
    <SplitterProvider value={splitter}>
      <ui.div {...mergedProps} />
    </SplitterProvider>
  )
}
