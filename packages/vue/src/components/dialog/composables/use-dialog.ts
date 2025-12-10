import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../namespace'
import type { EmitFn, Optional } from '~/types'
import * as dialog from '@destyler/dialog'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseDialogProps
  extends Optional<Omit<dialog.Context, 'dir' | 'getRootNode' | 'open.controlled'>, 'id'> {
  /**
   * The initial open state of the dialog when it is first rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: dialog.Context['open']
}

export interface UseDialogReturn extends ComputedRef<dialog.Api<PropTypes>> {}

export function useDialog(props: UseDialogProps = {}, emit?: EmitFn<RootEmits>) {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)
  const context = computed<dialog.Context>(() => ({
    id,
    'dir': locale.value.dir,
    'open': props.defaultOpen,
    'open.controlled': props.open !== undefined,
    'getRootNode': env?.value.getRootNode,
    'onOpenChange': (details) => {
      emit?.('openChange', details)
      emit?.('update:open', details.open)
    },
    'onEscapeKeyDown': details => emit?.('escapeKeyDown', details),
    'onFocusOutside': details => emit?.('focusOutside', details),
    'onInteractOutside': details => emit?.('interactOutside', details),
    'onPointerDownOutside': details => emit?.('pointerDownOutside', details),
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(dialog.machine(context.value), { context })

  return computed(() => dialog.connect(state.value, send, normalizeProps))
}
