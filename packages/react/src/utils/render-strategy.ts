import { createContext } from './create-context'
import { createSplitProps } from './create-split-props'

export interface RenderStrategyProps {
  /**
   * Whether to enable lazy mounting
   * @default false
   */
  lazyMount?: boolean
  /**
   * Whether to unmount on exit.
   * @default false
   */
  unmountOnExit?: boolean
}

export const [RenderStrategyPropsProvider, useRenderStrategyPropsContext] = createContext<RenderStrategyProps>({
  name: 'RenderStrategyContext',
  hookName: 'useRenderStrategyContext',
  providerName: '<RenderStrategyPropsProvider />',
})

export function splitRenderStrategyProps<T extends RenderStrategyProps>(props: T) {
  return createSplitProps<RenderStrategyProps>()(props, ['lazyMount', 'unmountOnExit'])
}
