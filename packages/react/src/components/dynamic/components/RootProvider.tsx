import type { UseDynamicReturn } from '../hooks/use-dynamic'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { DynamicProvider } from '../hooks/use-dynamic-context'

interface RootProviderProps {
  value: UseDynamicReturn
}

export interface DynamicRootProviderBaseProps extends RootProviderProps, PolymorphicProps {}
export interface DynamicRootProviderProps extends HTMLProps<'div'>, DynamicRootProviderBaseProps {}

export const DynamicRootProvider = forwardRef<HTMLDivElement, DynamicRootProviderProps>((props, ref) => {
  const [{ value: dynamic }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(dynamic.getRootProps(), localProps)

  return (
    <DynamicProvider value={dynamic}>
      <ui.div {...mergedProps} ref={ref} />
    </DynamicProvider>
  )
})

DynamicRootProvider.displayName = 'DynamicRootProvider'
