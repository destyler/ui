import type { UseToggleGroupReturn } from '../hooks/use-toggle-group'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { ToggleGroupProvider } from '../hooks/use-toggle-group-context'

interface RootProviderProps {
  value: UseToggleGroupReturn
}

export interface ToggleGroupRootProviderBaseProps extends RootProviderProps, PolymorphicProps {}
export interface ToggleGroupRootProviderProps extends HTMLProps<'div'>, ToggleGroupRootProviderBaseProps {}

export const ToggleGroupRootProvider = forwardRef<HTMLDivElement, ToggleGroupRootProviderProps>((props, ref) => {
  const [{ value: toggleGroup }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(toggleGroup.getRootProps(), localProps)

  return (
    <ToggleGroupProvider value={toggleGroup}>
      <ui.div {...mergedProps} ref={ref} />
    </ToggleGroupProvider>
  )
})

ToggleGroupRootProvider.displayName = 'ToggleGroupRootProvider'
