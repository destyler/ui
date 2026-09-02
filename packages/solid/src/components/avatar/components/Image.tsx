import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useAvatarContext } from '../hooks/use-avatar-context'

export interface AvatarImageBaseProps extends PolymorphicProps<'img'> {}
export interface AvatarImageProps extends HTMLProps<'img'>, AvatarImageBaseProps {}

export function AvatarImage(props: AvatarImageProps) {
  const context = useAvatarContext()
  const mergedProps = mergeProps(() => context().getImageProps(), props)
  return <ui.img {...mergedProps} />
}
