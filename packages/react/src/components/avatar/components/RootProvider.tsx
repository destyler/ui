import type { UseAvatarReturn } from '../hooks/use-avatar'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { AvatarProvider } from '../hooks/use-avatar-context'

interface RootProviderProps {
  value: UseAvatarReturn
}

export interface AvatarRootProviderBaseProps extends RootProviderProps, PolymorphicProps {}
export interface AvatarRootProviderProps extends HTMLProps<'div'>, AvatarRootProviderBaseProps {}

export const AvatarRootProvider = forwardRef<HTMLDivElement, AvatarRootProviderProps>((props, ref) => {
  const [{ value: avatar }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(avatar.getRootProps(), localProps)

  return (
    <AvatarProvider value={avatar}>
      <ui.div {...mergedProps} ref={ref} />
    </AvatarProvider>
  )
})

AvatarRootProvider.displayName = 'AvatarRootProvider'
