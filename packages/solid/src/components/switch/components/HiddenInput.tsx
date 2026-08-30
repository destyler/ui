import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { useFieldContext } from '~/components/field'
import { ui } from '~/factory'
import { useSwitchContext } from '../hooks/use-switch-context'

export interface SwitchHiddenInputBaseProps extends PolymorphicProps<'input'> {}
export interface SwitchHiddenInputProps extends HTMLProps<'input'>, SwitchHiddenInputBaseProps {}

export function SwitchHiddenInput(props: SwitchHiddenInputProps) {
  const api = useSwitchContext()
  const mergedProps = mergeProps(() => api().getHiddenInputProps(), props)
  const field = useFieldContext()

  return <ui.input aria-describedby={field?.().ariaDescribedby} {...mergedProps} />
}
