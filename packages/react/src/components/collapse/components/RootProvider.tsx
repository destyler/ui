import type { UseCollapseReturn } from '../hooks/use-collapse'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { RenderStrategyProps } from '~/utils/render-strategy'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import {
  RenderStrategyPropsProvider,
  splitRenderStrategyProps,
} from '~/utils/render-strategy'
import { CollapseProvider } from '../hooks/use-collapse-context'

interface RootProviderProps {
  value: UseCollapseReturn
}

export interface CollapseRootProviderBaseProps extends RootProviderProps, RenderStrategyProps, PolymorphicProps {}
export interface CollapseRootProviderProps extends HTMLProps<'div'>, CollapseRootProviderBaseProps {}

export const CollapseRootProvider = forwardRef<HTMLDivElement, CollapseRootProviderProps>((props, ref) => {
  const [renderStrategyProps, collapseProps] = splitRenderStrategyProps(props)
  const [{ value: collapse }, localProps] = createSplitProps<RootProviderProps>()(collapseProps, ['value'])
  const mergedProps = mergeProps(collapse.getRootProps(), localProps)

  return (
    <CollapseProvider value={collapse}>
      <RenderStrategyPropsProvider value={renderStrategyProps}>
        <ui.div {...mergedProps} ref={ref} />
      </RenderStrategyPropsProvider>
    </CollapseProvider>
  )
})

CollapseRootProvider.displayName = 'CollapseRootProvider'
