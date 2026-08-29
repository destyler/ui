import type {
  AnyEventObject,
  EventObject,
  HookOptions,
  Machine,
  MachineSrc,
  StateSchema,
  XState,
} from '@destyler/xstate'
import { reflect } from '@destyler/svelte'
import { onDestroy, onMount, untrack } from 'svelte'

function copyOptions<T extends Record<string, any>>(value: T | undefined): T | undefined {
  return value ? { ...value } : value
}

export function useActor<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
>(service: Machine<TContext, TState, TEvent>) {
  let currentState = $state.raw(service.state)
  const state = reflect(() => currentState) as XState<TContext, TState, TEvent>
  const unsubscribe = service.subscribe((nextState) => {
    currentState = nextState
  })

  onDestroy(unsubscribe)

  return [state, service.send] as const
}

/**
 * Destyler machine adapter that keeps class instances in machine context intact.
 *
 * @destyler/svelte 0.2.6 snapshots context through `$state.snapshot`, which
 * turns values such as ListCollection and Color into plain objects. A deep
 * `$state` proxy also violates invariants on XState methods, so this adapter
 * deliberately uses a shallow context copy and a raw state reference until
 * the shared adapter can preserve class identity itself.
 */
export function useMachine<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
>(machine: MachineSrc<TContext, TState, TEvent>, options?: HookOptions<TContext, TState, TEvent>) {
  const service = typeof machine === 'function' ? machine() : machine

  service.setContext(copyOptions(options?.context))
  if (options?.actions)
    service.setOptions({ actions: copyOptions(options.actions) })
  service._created()

  $effect(() => {
    if (!options?.actions)
      return

    const actions = copyOptions(options.actions)
    untrack(() => service.setOptions({ actions }))
  })

  $effect(() => {
    const context = copyOptions(options?.context)
    untrack(() => service.setContext(context))
  })

  const [state] = useActor(service)

  onMount(() => {
    service.start(options?.state)
    return service.stop
  })

  return [state, service.send, service] as const
}
