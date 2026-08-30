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

const renderStrategyProviderTuple = createContext<RenderStrategyProps>({
  hookName: 'useRenderStrategyContext',
  providerName: '<RenderStrategyProvider />',
})

export const RenderStrategyProvider = renderStrategyProviderTuple[0]
export const useRenderStrategyContext = renderStrategyProviderTuple[1]

export function splitRenderStrategyProps<T extends RenderStrategyProps>(props: T) {
  return createSplitProps<RenderStrategyProps>()(props, ['lazyMount', 'unmountOnExit'])
}
