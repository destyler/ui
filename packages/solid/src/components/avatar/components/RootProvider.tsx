import type { UseAvatarReturn } from '../hooks/use-avatar'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { AvatarProvider } from '../hooks/use-avatar-context'

interface RootProviderProps {
  value: UseAvatarReturn
}

export interface AvatarRootProviderBaseProps extends PolymorphicProps<'div'> {}
export interface AvatarRootProviderProps
  extends HTMLProps<'div'>,
  RootProviderProps,
  AvatarRootProviderBaseProps {}

export function AvatarRootProvider(props: AvatarRootProviderProps) {
  const [providerProps, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const avatar = () => providerProps.value()
  const mergedProps = mergeProps(() => avatar().getRootProps(), localProps)

  return (
    <AvatarProvider value={avatar}>
      <ui.div {...mergedProps} />
    </AvatarProvider>
  )
}
