export { avatarAnatomy } from './anatomy'
export { default as AvatarContext, type AvatarContextProps } from './components/Context.svelte'
export {
  default as AvatarFallback,
  type AvatarFallbackBaseProps,
  type AvatarFallbackProps,
} from './components/Fallback.svelte'
export { default as AvatarImage, type AvatarImageBaseProps, type AvatarImageProps } from './components/Image.svelte'
export { default as AvatarRoot, type AvatarRootBaseProps, type AvatarRootProps } from './components/Root.svelte'
export {
  default as AvatarRootProvider,
  type AvatarRootProviderBaseProps,
  type AvatarRootProviderProps,
} from './components/RootProvider.svelte'
export { useAvatarContext, type UseAvatarContext } from './hooks/use-avatar-context'
export { useAvatar, type UseAvatarProps, type UseAvatarReturn } from './hooks/use-avatar.svelte'
export * as Avatar from './namespace'

export type { StatusChangeDetails as AvatarStatusChangeDetails } from '@destyler/image'
