import type { UseCollapseProps } from '../hooks/use-collapse'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { RenderStrategyProps } from '~/utils/render-strategy'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import {

  RenderStrategyProvider,
  splitRenderStrategyProps,
} from '~/utils/render-strategy'
import { useCollapse } from '../hooks/use-collapse'
import { CollapseProvider } from '../hooks/use-collapse-context'

export interface CollapseRootBaseProps
  extends UseCollapseProps,
  RenderStrategyProps,
  PolymorphicProps<'div'> {}
export interface CollapseRootProps extends HTMLProps<'div'>, CollapseRootBaseProps {}

export function CollapseRoot(props: CollapseRootProps) {
  const [renderStrategyProps, collapseProps] = splitRenderStrategyProps(props)
  const [useCollapseProps, localProps] = createSplitProps<UseCollapseProps>()(collapseProps, [
    'collapsible',
    'defaultValue',
    'disabled',
    'id',
    'ids',
    'multiple',
    'onFocusChange',
    'onValueChange',
    'orientation',
    'value',
  ])
  const api = useCollapse(useCollapseProps)
  const mergedProps = mergeProps(() => api().getRootProps(), localProps)

  return (
    <CollapseProvider value={api}>
      <RenderStrategyProvider value={renderStrategyProps}>
        <ui.div {...mergedProps} />
      </RenderStrategyProvider>
    </CollapseProvider>
  )
}
