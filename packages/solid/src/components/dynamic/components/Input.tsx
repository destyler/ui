import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useDynamicContext } from '../hooks/use-dynamic-context'

export interface DynamicInputBaseProps extends PolymorphicProps<'input'> {}
export interface DynamicInputProps extends HTMLProps<'input'>, DynamicInputBaseProps {}

export function DynamicInput(props: DynamicInputProps) {
  const api = useDynamicContext()
  const mergedProps = mergeProps(() => api().getInputProps(), props)

  return <ui.input {...mergedProps} />
}
