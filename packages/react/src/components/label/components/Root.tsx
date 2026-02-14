import type { UseLabelProps } from '../hooks/use-label'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useLabel } from '../hooks/use-label'
import { LabelProvider } from '../hooks/use-label-context'

export interface LabelRootBaseProps extends UseLabelProps, PolymorphicProps {}
export interface LabelRootProps extends HTMLProps<'label'>, LabelRootBaseProps {}

export const LabelRoot = forwardRef<HTMLLabelElement, LabelRootProps>((props, ref) => {
  const [useLabelProps, localProps] = splitProps(props)
  const label = useLabel(useLabelProps)

  const mergedProps = mergeProps(label.getRootProps(), localProps)

  return (
    <LabelProvider value={label}>
      <ui.label {...mergedProps} ref={ref} />
    </LabelProvider>
  )
})

LabelRoot.displayName = 'LabelRoot'

function splitProps(props: LabelRootProps): [UseLabelProps, Omit<LabelRootProps, keyof UseLabelProps>] {
  const { id, ...rest } = props
  return [{ id }, rest]
}
