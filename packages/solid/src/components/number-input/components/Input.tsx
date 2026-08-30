import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { useFieldContext } from '~/components/field'
import { ui } from '~/factory'
import { useNumberInputContext } from '../hooks/use-number-input-context'

export interface NumberInputInputBaseProps extends PolymorphicProps<'input'> {}
export interface NumberInputInputProps extends HTMLProps<'input'>, NumberInputInputBaseProps {}

export function NumberInputInput(props: NumberInputInputProps) {
  const api = useNumberInputContext()
  const mergedProps = mergeProps(
    () => ({ readOnly: undefined, ...api().getInputProps() }),
    props,
  )
  const field = useFieldContext()

  return <ui.input aria-describedby={field?.().ariaDescribedby} {...mergedProps} />
}
