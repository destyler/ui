import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../types'
import type { EmitFn, Optional } from '~/types'
import * as image from '@destyler/image'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseAvatarProps extends Optional<Omit<image.Context, 'dir' | 'getRootNode'>, 'id'> {}
export interface UseAvatarReturn extends ComputedRef<image.Api<PropTypes>> {}

export function useAvatar(props: UseAvatarProps = {}, emit?: EmitFn<RootEmits>): UseAvatarReturn {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)

  const context = computed<image.Context>(() => ({
    id,
    dir: locale.value.dir,
    getRootNode: env?.value.getRootNode,
    onStatusChange: details => emit?.('statusChange', details),
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(image.machine(context.value), { context })
  return computed(() => image.connect(state.value, send, normalizeProps))
}
