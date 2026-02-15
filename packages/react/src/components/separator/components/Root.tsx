import type { RootProps } from '../types'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useSeparator } from '../hooks/use-separator'
import { SeparatorProvider } from '../hooks/use-separator-context'

export interface SeparatorRootBaseProps extends RootProps {}
export interface SeparatorRootProps
  extends HTMLProps<'div'>,
  PolymorphicProps,
  SeparatorRootBaseProps {}

export const SeparatorRoot = forwardRef<HTMLDivElement, SeparatorRootProps>(
  (props, ref) => {
    const [separatorProps, localProps] = createSplitProps<RootProps>()(props, [
      'id',
      'orientation',
    ])
    const api = useSeparator(separatorProps)

    const mergedProps = mergeProps(api.getRootProps(separatorProps.orientation), localProps)

    return (
      <SeparatorProvider value={api}>
        <ui.div {...mergedProps} ref={ref} />
      </SeparatorProvider>
    )
  },
)

SeparatorRoot.displayName = 'SeparatorRoot'
