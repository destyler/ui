import type { AnyEventObject, EventObject, HookOptions, MachineSrc, StateSchema } from '@destyler/xstate'
import { useLayoutEffect } from 'react'
import { useMachine as useSourceMachine } from '../../use-machine'
import { captureMountedMachine } from './raw-machine-capture'

/** Opt-in diagnostics: keep the production tuple and notification path unchanged. */
export function useMachine<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
>(machine: MachineSrc<TContext, TState, TEvent>, options?: HookOptions<TContext, TState, TEvent>) {
  'use no memo'
  const result = useSourceMachine(machine, options)
  const service = result[2]
  useLayoutEffect(() => {
    const release = captureMountedMachine(service)
    return () => {
      release?.()
    }
  }, [service])
  return result
}
