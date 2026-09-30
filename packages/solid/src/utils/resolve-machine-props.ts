/**
 * Optional UI props set to undefined are omissions, unlike core's own-key
 * ownership contract. Normalize before constructing the machine, including
 * public hooks and RootProvider callers that bypass Root's prop splitting.
 */
export function resolveMachineProps<T extends object>(props: T, omit: (keyof T)[] = []): T {
  const resolved = Object.fromEntries(
    Object.entries(props).filter(([key, value]) => value !== undefined && !omit.includes(key as keyof T)),
  )

  // Core initializes open from defaultOpen first. At the UI boundary an
  // explicit live value, including false, must take precedence over that seed.
  if (resolved.open !== undefined)
    delete resolved.defaultOpen

  return resolved as T
}
