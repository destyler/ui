import type { UseAvatarReturn } from './use-avatar'
import { createContext } from '~/utils'

export interface UseAvatarContext extends UseAvatarReturn {}
export const [AvatarProvider, useAvatarContext] = createContext<UseAvatarContext>('AvatarContext')
