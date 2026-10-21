// Preserve the existing post-unmount observation duration; this is a bounded
// negative-assertion window, not a deadline for positive async completion.
export const observationWindowMs = 35

// Unlike waitFor, this cannot accept silence before a delayed callback runs.
// Requires real timers: callers using fake timers must explicitly advance them.
export async function assertAfterObservationWindow(assertion: () => void) {
  await new Promise(resolve => setTimeout(resolve, observationWindowMs))
  assertion()
}
