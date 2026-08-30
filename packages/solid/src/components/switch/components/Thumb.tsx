import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useSwitchContext } from '../hooks/use-switch-context'

export interface SwitchThumbBaseProps extends PolymorphicProps<'span'> {}
export interface SwitchThumbProps extends HTMLProps<'span'>, SwitchThumbBaseProps {}

export function SwitchThumb(props: SwitchThumbProps) {
  const api = useSwitchContext()
  const mergedProps = mergeProps(() => api().getThumbProps(), props)

  return <ui.span {...mergedProps} />
}
