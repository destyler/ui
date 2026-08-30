import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { useToastContext } from '../hooks/use-toast-context'

export interface ToastRootBaseProps extends PolymorphicProps<'div'> {}
export interface ToastRootProps extends HTMLProps<'div'>, ToastRootBaseProps {}

export function ToastRoot(props: ToastRootProps) {
  const toast = useToastContext()
  const mergedProps = mergeProps(() => toast().getRootProps(), props)

  return (
    <div {...mergedProps}>
      <div {...toast().getGhostBeforeProps()} />
      {props.children}
      <div {...toast().getGhostAfterProps()} />
    </div>
  )
}
