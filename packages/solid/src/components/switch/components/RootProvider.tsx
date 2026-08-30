import type { UseSwitchReturn } from '../hooks/use-switch'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { SwitchProvider } from '../hooks/use-switch-context'

interface RootProviderProps {
  value: UseSwitchReturn
}

export interface SwitchRootProviderBaseProps extends PolymorphicProps<'label'> {}
export interface SwitchRootProviderProps
  extends HTMLProps<'label'>,
  RootProviderProps,
  SwitchRootProviderBaseProps {}

export function SwitchRootProvider(props: SwitchRootProviderProps) {
  const [{ value: api }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(() => api().getRootProps(), localProps)

  return (
    <SwitchProvider value={api}>
      <ui.label {...mergedProps} />
    </SwitchProvider>
  )
}
