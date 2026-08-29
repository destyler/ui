import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import * as avatar from '@destyler/image'
import { normalizeProps } from '@destyler/svelte'
import { runIfFn } from '@destyler/utils'

export interface UseAvatarProps extends Omit<avatar.Context, 'dir' | 'getRootNode' | 'id'> {
  id: string
}
export interface UseAvatarReturn extends Accessor<avatar.Api<PropTypes>> {}

export function useAvatar(props: MaybeFunction<UseAvatarProps>) {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props)
    return {
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ...resolvedProps,
    }
  })

  const [state, send] = useMachine(() => avatar.machine(machineProps as avatar.Context), {
    get context() {
      return machineProps as avatar.Context
    },
  })
  const api = $derived(avatar.connect(state, send, normalizeProps))
  return () => api
}
