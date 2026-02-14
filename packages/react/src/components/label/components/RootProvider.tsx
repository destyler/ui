import type { ReactNode } from 'react'
import type { UseLabelReturn } from '../hooks/use-label'
import { mergeProps } from '@destyler/react'
import { ui } from '~/factory'
import { LabelProvider } from '../hooks/use-label-context'

interface RootProviderProps {
  value: UseLabelReturn
}

export interface LabelRootProviderBaseProps extends RootProviderProps {}
export interface LabelRootProviderProps extends LabelRootProviderBaseProps {
  children?: ReactNode
}

export function LabelRootProvider(props: LabelRootProviderProps) {
  const { value: label, children, ...restProps } = props

  const mergedProps = mergeProps(label.getRootProps(), restProps)

  return (
    <LabelProvider value={label}>
      <ui.label {...mergedProps}>
        {children}
      </ui.label>
    </LabelProvider>
  )
}
