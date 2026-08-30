import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useAvatarContext } from '../hooks/use-avatar-context'

export interface AvatarFallbackBaseProps extends PolymorphicProps<'span'> {}
export interface AvatarFallbackProps extends HTMLProps<'span'>, AvatarFallbackBaseProps {}

export function AvatarFallback(props: AvatarFallbackProps) {
  const context = useAvatarContext()
  const mergedProps = mergeProps(() => context().getFallbackProps(), props)
  return <ui.span {...mergedProps} />
}
