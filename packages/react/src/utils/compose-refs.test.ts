import { describe, expect, it, vi } from 'vitest'
import { composeRefs } from './compose-refs'

describe('composeRefs lifecycle', () => {
  it('preserves legacy attach/null calls and object refs without returning a cleanup', () => {
    const node = document.createElement('button')
    const objectRef = { current: null as HTMLButtonElement | null }
    const callback = vi.fn()
    const ref = composeRefs(null, callback, undefined, objectRef)

    expect(ref(node)).toBeUndefined()
    expect(objectRef.current).toBe(node)
    expect(callback.mock.calls).toEqual([[node]])
    expect(ref(null)).toBeUndefined()
    expect(objectRef.current).toBeNull()
    expect(callback.mock.calls).toEqual([[node], [null]])
  })

  it('runs returned cleanups in ref order and nulls only refs without cleanup', () => {
    const node = document.createElement('button')
    const events: unknown[] = []
    const objectRef = { current: null as HTMLButtonElement | null }
    const first = vi.fn((value: HTMLButtonElement | null) => {
      events.push(['first', value])
      return () => {
        events.push(['cleanup first', objectRef.current])
      }
    })
    const legacy = vi.fn((value: HTMLButtonElement | null) => {
      events.push(['legacy', value])
    })
    const last = vi.fn((value: HTMLButtonElement | null) => {
      events.push(['last', value])
      return () => {
        events.push(['cleanup last', objectRef.current])
      }
    })
    const cleanup = composeRefs(first, legacy, objectRef, null, last)(node)
    expect(typeof cleanup).toBe('function')
    cleanup?.()

    expect(events).toEqual([
      ['first', node],
      ['legacy', node],
      ['last', node],
      ['cleanup first', node],
      ['legacy', null],
      ['cleanup last', null],
    ])
    expect(objectRef.current).toBeNull()
    expect(first).toHaveBeenCalledExactlyOnceWith(node)
    expect(last).toHaveBeenCalledExactlyOnceWith(node)
  })

  it('composes nested cleanup ownership without calling cleaned refs with null', () => {
    const node = document.createElement('button')
    const cleanup = vi.fn()
    const callback = vi.fn(() => cleanup)
    const innerObject = { current: null as HTMLButtonElement | null }
    const outerObject = { current: null as HTMLButtonElement | null }
    const legacy = vi.fn()
    const inner = composeRefs(callback, innerObject)
    const detach = composeRefs(inner, outerObject, legacy)(node)
    expect(typeof detach).toBe('function')
    detach?.()
    expect(cleanup).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledExactlyOnceWith(node)
    expect(legacy.mock.calls).toEqual([[node], [null]])
    expect(innerObject.current).toBeNull()
    expect(outerObject.current).toBeNull()
  })
})
