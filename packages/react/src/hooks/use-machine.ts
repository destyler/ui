import type { AnyEventObject, EventObject, HookOptions, MachineSrc, StateSchema } from '@destyler/xstate'
import { useMachine as useCoreMachine } from '@destyler/react'

export function useMachine<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
>(machine: MachineSrc<TContext, TState, TEvent>, options?: HookOptions<TContext, TState, TEvent>) {
  'use no memo'
  const [state, send, service] = useCoreMachine(machine, options)

  // Core snapshots track reads on every render. A compiler-cached connect call
  // can skip those reads on a prop update, losing the next state notification.
  // Keep this small boundary fresh instead of opting every component out.
  return [{ ...state }, send, service] as const
}
