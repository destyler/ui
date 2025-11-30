export { avatarAnatomy } from './anatomy'

export { default as AvatarContext, type AvatarContextProps } from './components/Context.vue'
export {
  default as AvatarFallback,
  type AvatarFallbackProps,
} from './components/Fallback.vue'
export { default as AvatarImage, type AvatarImageProps } from './components/Image.vue'
export {
  default as AvatarRoot,
  type AvatarRootEmits,
  type AvatarRootProps,
} from './components/Root.vue'
export {
  default as AvatarRootProvider,
  type AvatarRootProviderProps,
} from './components/RootProvider.vue'

export { useAvatar, type UseAvatarProps, type UseAvatarReturn } from './composables/use-avatar'
export { useAvatarContext, type UseAvatarContext } from './composables/use-avatar-context'

export * as Avatar from './namespace'

export type { StatusChangeDetails as AvatarStatusChangeDetails } from '@destyler/image'
