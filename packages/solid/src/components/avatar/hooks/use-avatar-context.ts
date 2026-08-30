import type { UseAvatarReturn } from './use-avatar'
import { createContext } from '~/utils/create-context'

export interface UseAvatarContext extends UseAvatarReturn {}

const avatarProviderTuple = createContext<UseAvatarContext>({
  hookName: 'useAvatarContext',
  providerName: '<AvatarProvider />',
})

export const AvatarProvider = avatarProviderTuple[0]
export const useAvatarContext = avatarProviderTuple[1]
