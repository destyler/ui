import { describe, expect, it } from 'vitest'
import { createSplitProps } from '~/utils/create-split-props'

interface FullProps {
  a: string
  b: number
  c: boolean
  d: string
}

describe('util: createSplitProps', () => {
  it('should split props by specified keys', () => {
    const splitProps = createSplitProps<FullProps>()

    const props: FullProps = {
      a: 'value-a',
      b: 42,
      c: true,
      d: 'value-d',
    }

    const [target, rest] = splitProps(props, ['a', 'b', 'c', 'd'])

    expect(target).toEqual({
      a: 'value-a',
      b: 42,
      c: true,
      d: 'value-d',
    })
    expect(rest).toEqual({})
  })

  it('should separate target and rest props', () => {
    const splitProps = createSplitProps<{ a: string, b: number }>()

    const props = {
      a: 'value-a',
      b: 42,
      extra: 'extra-value',
    }

    const [target, rest] = splitProps(props as any, ['a', 'b'])

    expect(target).toEqual({
      a: 'value-a',
      b: 42,
    })
    expect(rest).toEqual({
      extra: 'extra-value',
    })
  })

  it('should handle undefined values in props', () => {
    const splitProps = createSplitProps<{ a?: string, b: number }>()

    const props = {
      a: undefined,
      b: 42,
    }

    const [target, rest] = splitProps(props as any, ['a', 'b'])

    // undefined values are not included in target
    expect(target).toEqual({
      b: 42,
    })
    expect(rest).toEqual({})
  })

  it('should handle empty keys array', () => {
    const splitProps = createSplitProps<Record<string, never>>()

    const props = {
      a: 'value-a',
      b: 42,
    }

    const [target, rest] = splitProps(props as any, [] as any)

    expect(target).toEqual({})
    expect(rest).toEqual({
      a: 'value-a',
      b: 42,
    })
  })

  it('should handle empty props', () => {
    const splitProps = createSplitProps<{ a: string }>()

    const props = {}

    const [target, rest] = splitProps(props as any, ['a'])

    expect(target).toEqual({})
    expect(rest).toEqual({})
  })

  it('should not include keys that are not in props', () => {
    const splitProps = createSplitProps<{ a: string, b: number }>()

    const props = {
      a: 'value-a',
    }

    const [target, rest] = splitProps(props as any, ['a', 'b'])

    expect(target).toEqual({
      a: 'value-a',
    })
    expect(rest).toEqual({})
  })

  it('should preserve original props values', () => {
    const splitProps = createSplitProps<{ a: string }>()

    const originalProps = {
      a: 'original',
      extra: 'extra',
    }

    const [target, rest] = splitProps(originalProps as any, ['a'])

    expect(target.a).toBe('original')
    expect(rest.extra).toBe('extra')
  })
})
