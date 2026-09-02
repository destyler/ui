import type { JSX } from 'solid-js'
import type { UseAvatarContext } from '../hooks/use-avatar-context'
import { useAvatarContext } from '../hooks/use-avatar-context'

export interface AvatarContextProps {
  children: (context: UseAvatarContext) => JSX.Element
}

export const AvatarContext = (props: AvatarContextProps) => props.children(useAvatarContext())
