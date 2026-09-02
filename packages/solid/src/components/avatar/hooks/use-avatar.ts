import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import * as avatar from '@destyler/image'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseAvatarProps
  extends Optional<Omit<avatar.Context, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseAvatarReturn extends Accessor<avatar.Api<PropTypes>> {}

export function useAvatar(props: UseAvatarProps = {}): UseAvatarReturn {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const id = createUniqueId()

  const context = createMemo<avatar.Context>(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    ...props,
  }))
  const [state, send] = useMachine(avatar.machine(context()), { context })

  return createMemo(() => avatar.connect(state, send, normalizeProps))
}
