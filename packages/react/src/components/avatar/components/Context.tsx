import type { ReactNode } from 'react'
import type { UseAvatarContext } from '../hooks/use-avatar-context'
import { useAvatarContext } from '../hooks/use-avatar-context'

export interface AvatarContextProps {
  children: (context: UseAvatarContext) => ReactNode
}

export const AvatarContext = (props: AvatarContextProps) => props.children(useAvatarContext())
