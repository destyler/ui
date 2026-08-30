import type { UseCollapseReturn } from '../hooks/use-collapse'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { RenderStrategyProps } from '~/utils/render-strategy'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import {

  RenderStrategyProvider,
  splitRenderStrategyProps,
} from '~/utils/render-strategy'
import { CollapseProvider } from '../hooks/use-collapse-context'

interface RootProviderProps {
  value: UseCollapseReturn
}

export interface CollapseRootProviderBaseProps
  extends RootProviderProps,
  RenderStrategyProps,
  PolymorphicProps<'div'> {}
export interface CollapseRootProviderProps
  extends HTMLProps<'div'>,
  CollapseRootProviderBaseProps {}

export function CollapseRootProvider(props: CollapseRootProviderProps) {
  const [renderStrategyProps, collapseProps] = splitRenderStrategyProps(props)
  const [providerProps, localProps] = createSplitProps<RootProviderProps>()(collapseProps, [
    'value',
  ])
  const collapse = () => providerProps.value()

  const mergedProps = mergeProps(() => collapse().getRootProps(), localProps)

  return (
    <CollapseProvider value={collapse}>
      <RenderStrategyProvider value={renderStrategyProps}>
        <ui.div {...mergedProps} />
      </RenderStrategyProvider>
    </CollapseProvider>
  )
}
