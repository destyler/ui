export { avatarAnatomy } from './anatomy'
export { AvatarContext, type AvatarContextProps } from './components/Context'
export {
  AvatarFallback,
  type AvatarFallbackBaseProps,
  type AvatarFallbackProps,
} from './components/Fallback'
export { AvatarImage, type AvatarImageBaseProps, type AvatarImageProps } from './components/Image'
export { AvatarRoot, type AvatarRootBaseProps, type AvatarRootProps } from './components/Root'
export {
  AvatarRootProvider,
  type AvatarRootProviderBaseProps,
  type AvatarRootProviderProps,
} from './components/RootProvider'
export { useAvatar, type UseAvatarProps, type UseAvatarReturn } from './hooks/use-avatar'
export { useAvatarContext, type UseAvatarContext } from './hooks/use-avatar-context'
export * as Avatar from './namespace'

export type { StatusChangeDetails as AvatarStatusChangeDetails } from '@destyler/image'
