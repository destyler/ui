import { describe, expect, it } from 'vitest'
import { cleanProps } from '~/utils/clean-props'

describe('util: cleanProps', () => {
  it('should remove undefined values from object', () => {
    const obj = {
      a: 'value',
      b: undefined,
      c: 123,
      d: undefined,
    }

    const result = cleanProps(obj)

    expect(result).toEqual({
      a: 'value',
      c: 123,
    })
    expect(result).not.toHaveProperty('b')
    expect(result).not.toHaveProperty('d')
  })

  it('should keep null values', () => {
    const obj = {
      a: 'value',
      b: null,
      c: undefined,
    }

    const result = cleanProps(obj)

    expect(result).toEqual({
      a: 'value',
      b: null,
    })
  })

  it('should keep falsy values except undefined', () => {
    const obj = {
      a: 0,
      b: '',
      c: false,
      d: undefined,
    }

    const result = cleanProps(obj)

    expect(result).toEqual({
      a: 0,
      b: '',
      c: false,
    })
  })

  it('should return empty object when all values are undefined', () => {
    const obj = {
      a: undefined,
      b: undefined,
    }

    const result = cleanProps(obj)

    expect(result).toEqual({})
  })

  it('should return same object when no undefined values', () => {
    const obj = {
      a: 'value',
      b: 123,
      c: true,
    }

    const result = cleanProps(obj)

    expect(result).toEqual({
      a: 'value',
      b: 123,
      c: true,
    })
  })

  it('should handle nested objects (without deep cleaning)', () => {
    const obj = {
      a: 'value',
      b: { nested: undefined },
      c: undefined,
    }

    const result = cleanProps(obj)

    expect(result).toEqual({
      a: 'value',
      b: { nested: undefined },
    })
  })

  it('should handle empty object', () => {
    const obj = {}
    const result = cleanProps(obj)
    expect(result).toEqual({})
  })

  it('should handle arrays as values', () => {
    const obj = {
      a: [1, 2, 3],
      b: undefined,
      c: [],
    }

    const result = cleanProps(obj)

    expect(result).toEqual({
      a: [1, 2, 3],
      c: [],
    })
  })
})
