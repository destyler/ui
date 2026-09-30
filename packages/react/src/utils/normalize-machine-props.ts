/**
 * UI optional props use `undefined` to mean uncontrolled. Core 0.2.7 records
 * own-key presence before compacting, so omit those keys before construction.
 * Its open resolver also prefers defaultOpen; a supplied live open must win.
 */
export function normalizeMachineProps<T extends object>(props: T): T {
  const result = Object.fromEntries(Object.entries(props).filter(([, value]) => value !== undefined))
  if (result.open !== undefined)
    delete result.defaultOpen
  return result as T
}
