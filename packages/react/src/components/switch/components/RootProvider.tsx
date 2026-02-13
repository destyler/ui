import type { UseSwitchReturn } from '../hooks/use-switch'
import type {HTMLProps, PolymorphicProps} from '~/factory';
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import {   ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { SwitchProvider } from '../hooks/use-switch-context'

interface RootProviderProps {
  value: UseSwitchReturn
}

export interface SwitchRootProviderBaseProps extends RootProviderProps, PolymorphicProps {}
export interface SwitchRootProviderProps extends HTMLProps<'label'>, SwitchRootProviderBaseProps {}

export const SwitchRootProvider = forwardRef<HTMLLabelElement, SwitchRootProviderProps>((props, ref) => {
  const [{ value: api }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(api.getRootProps(), localProps)

  return (
    <SwitchProvider value={api}>
      <ui.label {...mergedProps} ref={ref} />
    </SwitchProvider>
  )
})

SwitchRootProvider.displayName = 'SwitchRootProvider'
