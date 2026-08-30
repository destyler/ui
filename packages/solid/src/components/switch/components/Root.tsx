import type { UseSwitchProps } from '../hooks/use-switch'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useSwitch } from '../hooks/use-switch'
import { SwitchProvider } from '../hooks/use-switch-context'

export interface SwitchRootBaseProps extends UseSwitchProps, PolymorphicProps<'label'> {}
export interface SwitchRootProps extends HTMLProps<'label'>, SwitchRootBaseProps {}

export function SwitchRoot(props: SwitchRootProps) {
  const [switchProps, localProps] = createSplitProps<UseSwitchProps>()(props, [
    'checked',
    'defaultChecked',
    'disabled',
    'form',
    'id',
    'ids',
    'invalid',
    'label',
    'name',
    'onCheckedChange',
    'readOnly',
    'required',
    'value',
  ])
  const api = useSwitch(switchProps)
  const mergedProps = mergeProps(() => api().getRootProps(), localProps)

  return (
    <SwitchProvider value={api}>
      <ui.label {...mergedProps} />
    </SwitchProvider>
  )
}
