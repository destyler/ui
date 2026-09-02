import { orFallback } from './or-fallback'

describe('util: orFallback', () => {
  it('preserves 0 and empty string', () => {
    expect(orFallback(0, 'fallback')).toEqual(0)
    expect(orFallback('', 'fallback')).toEqual('')
  })

  it('uses fallback for false, null, and undefined', () => {
    expect(orFallback(false, 'fallback')).toEqual('fallback')
    expect(orFallback(null, 'fallback')).toEqual('fallback')
    expect(orFallback(undefined, 'fallback')).toEqual('fallback')
  })

  it('preserves a non-empty string', () => {
    expect(orFallback('x', 'fallback')).toEqual('x')
  })
})
