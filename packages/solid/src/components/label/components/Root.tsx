import type { UseLabelProps } from '../hooks/use-label'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useLabel } from '../hooks/use-label'
import { LabelProvider } from '../hooks/use-label-context'

export interface LabelRootBaseProps extends UseLabelProps, PolymorphicProps<'label'> {}
export interface LabelRootProps extends HTMLProps<'label'>, LabelRootBaseProps {}

export function LabelRoot(props: LabelRootProps) {
  const [useLabelProps, localProps] = createSplitProps<UseLabelProps>()(props, ['id', 'ids'])
  const label = useLabel(useLabelProps)
  const mergedProps = mergeProps(() => label().getRootProps(), localProps)

  return (
    <LabelProvider value={label}>
      <ui.label {...mergedProps} />
    </LabelProvider>
  )
}
