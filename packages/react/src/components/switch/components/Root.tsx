import type { UseSwitchProps } from '../hooks/use-switch'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useSwitch } from '../hooks/use-switch'
import { SwitchProvider } from '../hooks/use-switch-context'

export interface SwitchRootBaseProps extends UseSwitchProps, PolymorphicProps {}
export interface SwitchRootProps extends HTMLProps<'label'>, SwitchRootBaseProps {}

export const SwitchRoot = forwardRef<HTMLLabelElement, SwitchRootProps>((props, ref) => {
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

  const switchContext = useSwitch(switchProps)
  const mergedProps = mergeProps(switchContext.getRootProps(), localProps)

  return (
    <SwitchProvider value={switchContext}>
      <ui.label {...mergedProps} ref={ref} />
    </SwitchProvider>
  )
})

SwitchRoot.displayName = 'SwitchRoot'
