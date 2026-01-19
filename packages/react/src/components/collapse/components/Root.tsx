import type { UseCollapseProps } from '../hooks/use-collapse'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import type { RenderStrategyProps } from '~/utils/render-strategy'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import {
  RenderStrategyPropsProvider,
  splitRenderStrategyProps,
} from '~/utils/render-strategy'
import { useCollapse } from '../hooks/use-collapse'
import { CollapseProvider } from '../hooks/use-collapse-context'

export interface CollapseRootBaseProps extends UseCollapseProps, RenderStrategyProps, PolymorphicProps {}
export interface CollapseRootProps extends Assign<HTMLProps<'div'>, CollapseRootBaseProps> {}

export const CollapseRoot = forwardRef<HTMLDivElement, CollapseRootProps>((props, ref) => {
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
  const collapse = useCollapse(useCollapseProps)
  const mergedProps = mergeProps(collapse.getRootProps(), localProps)

  return (
    <CollapseProvider value={collapse}>
      <RenderStrategyPropsProvider value={renderStrategyProps}>
        <ui.div {...mergedProps} ref={ref} />
      </RenderStrategyPropsProvider>
    </CollapseProvider>
  )
})

CollapseRoot.displayName = 'CollapseRoot'
