import type { AnyEventObject, EventObject, HookOptions, MachineSrc, StateSchema } from '@destyler/xstate'
import { useLayoutEffect } from 'react'
import { useMachine as useSourceMachine } from '../../use-machine'

type RecordEntry = (type: string, details: unknown) => void
let record: RecordEntry | undefined
const readers = new Map<string, () => unknown>()

export function observeMachines(nextRecord: RecordEntry) {
  record = nextRecord
  return () => {
    record = undefined
    readers.clear()
  }
}

export function readObservedMachine(id: string) {
  return readers.get(id)?.()
}

/** Opt-in diagnostics only: preserve the source hook and its returned tuple. */
export function useMachine<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
>(machine: MachineSrc<TContext, TState, TEvent>, options?: HookOptions<TContext, TState, TEvent>) {
  'use no memo'
  const result = useSourceMachine(machine, options)
  const service = result[2]
  useLayoutEffect(() => {
    const write = record
    const read = () => {
      const state = service.getState()
      return {
        id: service.id,
        value: state.value,
        tags: state.tags,
        event: state.event,
        open: state.context.open,
        isPointer: state.context.isPointer,
      }
    }
    readers.set(service.id, read)
    const unsubscribe = service.subscribe(() => write?.('machine notification', read()))
    return () => {
      write?.('machine cleanup', read())
      unsubscribe()
      readers.delete(service.id)
    }
  }, [service])
  return result
}
