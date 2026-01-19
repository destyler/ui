import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import * as image from '@destyler/image'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseAvatarProps extends Optional<Omit<image.Context, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseAvatarReturn extends image.Api<PropTypes> {}

export function useAvatar(props: UseAvatarProps = {}): UseAvatarReturn {
  const { getRootNode } = useEnvironmentContext()
  const { dir } = useLocaleContext()

  const initialContext: image.Context = {
    id: useId(),
    dir,
    getRootNode,
    ...props,
  }

  const context: image.Context = {
    ...initialContext,
    onStatusChange: useEvent(props.onStatusChange),
  }

  const [state, send] = useMachine(image.machine(initialContext), { context })
  return image.connect(state, send, normalizeProps)
}
