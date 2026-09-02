import type { UseAvatarProps } from '../hooks/use-avatar'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useAvatar } from '../hooks/use-avatar'
import { AvatarProvider } from '../hooks/use-avatar-context'

export interface AvatarRootBaseProps extends UseAvatarProps, PolymorphicProps<'div'> {}
export interface AvatarRootProps extends HTMLProps<'div'>, AvatarRootBaseProps {}

export function AvatarRoot(props: AvatarRootProps) {
  const [useAvatarProps, localProps] = createSplitProps<UseAvatarProps>()(props, [
    'id',
    'ids',
    'onStatusChange',
  ])

  const context = useAvatar(useAvatarProps)
  const mergedProps = mergeProps(() => context().getRootProps(), localProps)

  return (
    <AvatarProvider value={context}>
      <ui.div {...mergedProps} />
    </AvatarProvider>
  )
}
