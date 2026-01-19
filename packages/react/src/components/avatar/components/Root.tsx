import type { UseAvatarProps } from '../hooks/use-avatar'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useAvatar } from '../hooks/use-avatar'
import { AvatarProvider } from '../hooks/use-avatar-context'

export interface AvatarRootBaseProps extends UseAvatarProps, PolymorphicProps {}
export interface AvatarRootProps extends HTMLProps<'div'>, AvatarRootBaseProps {}

export const AvatarRoot = forwardRef<HTMLDivElement, AvatarRootProps>((props, ref) => {
  const [useAvatarProps, localProps] = createSplitProps<UseAvatarProps>()(props, ['id', 'ids', 'onStatusChange'])
  const avatar = useAvatar(useAvatarProps)
  const mergedProps = mergeProps(avatar.getRootProps(), localProps)

  return (
    <AvatarProvider value={avatar}>
      <ui.div {...mergedProps} ref={ref} />
    </AvatarProvider>
  )
})

AvatarRoot.displayName = 'AvatarRoot'
