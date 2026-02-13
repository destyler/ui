import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useSwitchContext } from '../hooks/use-switch-context'

export interface SwitchLabelBaseProps extends PolymorphicProps {}
export interface SwitchLabelProps extends HTMLProps<'span'>, SwitchLabelBaseProps {}

export const SwitchLabel = forwardRef<HTMLSpanElement, SwitchLabelProps>((props, ref) => {
  const switchContext = useSwitchContext()
  const mergedProps = mergeProps(switchContext.getLabelProps(), props)

  return <ui.span {...mergedProps} ref={ref} />
})

SwitchLabel.displayName = 'SwitchLabel'
