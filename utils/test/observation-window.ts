// Negative assertions must not use waitFor: they can pass before a delayed
// unwanted callback runs. Preserve the existing post-unmount 35ms window.
export async function assertAfterObservationWindow(assertion: () => void) {
  await new Promise(resolve => setTimeout(resolve, 35))
  assertion()
}
