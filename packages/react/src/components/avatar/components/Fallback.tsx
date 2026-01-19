import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useAvatarContext } from '../hooks/use-avatar-context'

export interface AvatarFallbackBaseProps extends PolymorphicProps {}
export interface AvatarFallbackProps extends HTMLProps<'span'>, AvatarFallbackBaseProps {}

export const AvatarFallback = forwardRef<HTMLSpanElement, AvatarFallbackProps>((props, ref) => {
  const avatar = useAvatarContext()
  const mergedProps = mergeProps(avatar.getFallbackProps(), props)

  return <ui.span {...mergedProps} ref={ref} />
})

AvatarFallback.displayName = 'AvatarFallback'
