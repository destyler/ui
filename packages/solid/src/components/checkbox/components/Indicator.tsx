import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useCheckboxContext } from '../hooks/use-checkbox-context'

interface IndicatorProps {
  indeterminate?: boolean
}

export interface CheckboxIndicatorBaseProps extends IndicatorProps, PolymorphicProps<'div'> {}
export interface CheckboxIndicatorProps extends HTMLProps<'div'>, CheckboxIndicatorBaseProps {}

export function CheckboxIndicator(props: CheckboxIndicatorProps) {
  const [indicatorProps, localProps] = createSplitProps<IndicatorProps>()(props, ['indeterminate'])
  const checkbox = useCheckboxContext()
  const mergedProps = mergeProps(() => checkbox().getIndicatorProps(), localProps)

  return (
    <ui.div
      {...mergedProps}
      hidden={!(indicatorProps.indeterminate ? checkbox().indeterminate : checkbox().checked)}
    />
  )
}
