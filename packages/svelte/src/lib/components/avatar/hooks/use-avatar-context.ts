import type { UseAvatarReturn } from './use-avatar.svelte'
import { createContext } from '$lib/utils/create-context'

export interface UseAvatarContext extends UseAvatarReturn {}
export const [AvatarProvider, useAvatarContext] = createContext<UseAvatarContext>({
  name: 'AvatarContext',
})
