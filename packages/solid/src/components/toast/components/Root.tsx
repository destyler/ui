import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useToastContext } from '../hooks/use-toast-context'

export interface ToastRootBaseProps extends PolymorphicProps<'div'> {}
export interface ToastRootProps extends HTMLProps<'div'>, ToastRootBaseProps {}

export function ToastRoot(props: ToastRootProps) {
  const toast = useToastContext()
  const mergedProps = mergeProps(() => toast().getRootProps(), props)

  return (
    <ui.div {...mergedProps}>
      <ui.div {...toast().getGhostBeforeProps()} />
      {props.children}
      <ui.div {...toast().getGhostAfterProps()} />
    </ui.div>
  )
}
