import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useNumberInputContext } from '../hooks/use-number-input-context'

export interface NumberInputScrubberBaseProps extends PolymorphicProps<'div'> {}
export interface NumberInputScrubberProps extends HTMLProps<'div'>, NumberInputScrubberBaseProps {}

export function NumberInputScrubber(props: NumberInputScrubberProps) {
  const api = useNumberInputContext()
  const mergedProps = mergeProps(() => api().getScrubberProps(), props)

  return <ui.div {...mergedProps} />
}
