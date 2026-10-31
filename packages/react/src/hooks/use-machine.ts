import type { AnyEventObject, EventObject, HookOptions, MachineSrc, StateSchema } from '@destyler/xstate'
import { useMachine as useCoreMachine } from '@destyler/react'

export function useMachine<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
>(machine: MachineSrc<TContext, TState, TEvent>, options?: HookOptions<TContext, TState, TEvent>) {
  // Core 0.3.2 subscribes to the complete immutable snapshot and preserves its
  // identity until the actor changes. Do not clone it on prop-only renders.
  return useCoreMachine(machine, options)
}
