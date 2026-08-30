import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useFieldsetContext } from '../hooks/use-fieldset-context'

export interface FieldsetLegendBaseProps extends PolymorphicProps<'legend'> {}
export interface FieldsetLegendProps extends HTMLProps<'legend'>, FieldsetLegendBaseProps {}

export function FieldsetLegend(props: FieldsetLegendProps) {
  const fieldset = useFieldsetContext()
  const mergedProps = mergeProps(() => fieldset().getLegendProps(), props)

  return <ui.legend {...mergedProps} />
}
