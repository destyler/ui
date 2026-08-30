import type { UseDynamicReturn } from '../hooks/use-dynamic'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { DynamicProvider } from '../hooks/use-dynamic-context'

interface RootProviderProps {
  value: UseDynamicReturn
}

export interface DynamicRootProviderBaseProps extends PolymorphicProps<'div'> {}
export interface DynamicRootProviderProps
  extends HTMLProps<'div'>,
  RootProviderProps,
  DynamicRootProviderBaseProps {}

export function DynamicRootProvider(props: DynamicRootProviderProps) {
  const [{ value: dynamic }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(() => dynamic().getRootProps(), localProps)

  return (
    <DynamicProvider value={dynamic}>
      <ui.div {...mergedProps} />
    </DynamicProvider>
  )
}
