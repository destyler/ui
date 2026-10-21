import { expect, it, vi } from 'vitest'
import { assertAfterObservationWindow } from '../../../../utils/test/observation-window'

it('observes delayed unwanted callbacks instead of accepting initial silence', async () => {
  const callback = vi.fn()
  const timer = setTimeout(callback, 20)
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
