import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useAvatarContext } from '../hooks/use-avatar-context'

export interface AvatarImageBaseProps extends PolymorphicProps {}
export interface AvatarImageProps extends HTMLProps<'img'>, AvatarImageBaseProps {}

export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>((props, ref) => {
  const avatar = useAvatarContext()
  const mergedProps = mergeProps(avatar.getImageProps(), props)

  return <ui.img {...mergedProps} ref={ref} />
})

AvatarImage.displayName = 'AvatarImage'
