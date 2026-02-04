import type { UseSplitterReturn } from '../hooks/use-splitter'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { SplitterProvider } from '../hooks/use-splitter-context'

interface RootProviderProps {
  value: UseSplitterReturn
}

export interface SplitterRootProviderBaseProps extends RootProviderProps, PolymorphicProps {}
export interface SplitterRootProviderProps extends HTMLProps<'div'>, SplitterRootProviderBaseProps {}

export const SplitterRootProvider = forwardRef<HTMLDivElement, SplitterRootProviderProps>((props, ref) => {
  const [{ value: splitter }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(splitter.getRootProps(), localProps)

  return (
    <SplitterProvider value={splitter}>
      <ui.div {...mergedProps} ref={ref} />
    </SplitterProvider>
  )
})

SplitterRootProvider.displayName = 'SplitterRootProvider'
