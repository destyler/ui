import type { UseSplitterProps } from '../hooks/use-splitter'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { splitSplitterProps } from '../hooks/split-splitter-props'
import { useSplitter } from '../hooks/use-splitter'
import { SplitterProvider } from '../hooks/use-splitter-context'

export interface SplitterRootBaseProps extends UseSplitterProps, PolymorphicProps {}
export interface SplitterRootProps extends HTMLProps<'div'>, SplitterRootBaseProps {}

export const SplitterRoot = forwardRef<HTMLDivElement, SplitterRootProps>((props, ref) => {
  const [useSplitterProps, localProps] = splitSplitterProps(props)
  const splitter = useSplitter(useSplitterProps)
  const mergedProps = mergeProps(splitter.getRootProps(), localProps)

  return (
    <SplitterProvider value={splitter}>
      <ui.div {...mergedProps} ref={ref} />
    </SplitterProvider>
  )
})

SplitterRoot.displayName = 'SplitterRoot'
