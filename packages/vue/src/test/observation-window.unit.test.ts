import { expect, it, vi } from 'vitest'
import { assertAfterObservationWindow, observationWindowMs } from '../../../../utils/test/observation-window'

// Hosted here deliberately: vue-unit is the existing happy-dom unit project;
// the helper itself has no Vue dependency and is shared with React.
it('observes delayed unwanted callbacks instead of accepting initial silence', async () => {
  const callback = vi.fn()
  const timer = setTimeout(callback, observationWindowMs / 2)
  try {
    await expect(assertAfterObservationWindow(() => {
      expect(callback).not.toHaveBeenCalled()
    })).rejects.toThrow()
    expect(callback).toHaveBeenCalledOnce()
  }
  finally {
    clearTimeout(timer)
  }
})

it('accepts silence only after the observation window', async () => {
  const callback = vi.fn()
  await assertAfterObservationWindow(() => expect(callback).not.toHaveBeenCalled())
})
