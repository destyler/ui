import { describe, expect, it } from 'vitest'
import { createMachineProps } from '../create-machine-props'

describe('createMachineProps', () => {
  it('passes default* through and omits undefined live props', () => {
    const props = { value: undefined, defaultValue: 'draft', disabled: false }
    const result = createMachineProps(props, { value: 'defaultValue' })

    expect(result.initial).toStrictEqual({ defaultValue: 'draft', disabled: false })
    expect(result.context).toStrictEqual({ defaultValue: 'draft', disabled: false })
    expect(props).toStrictEqual({ value: undefined, defaultValue: 'draft', disabled: false })
  })

  it('keeps an explicit controlled value without *.controlled stamps', () => {
    const result = createMachineProps(
      { value: 'controlled', defaultValue: 'fallback' },
      { value: 'defaultValue' },
      ['value'],
    )

    expect(result.initial).toStrictEqual({ value: 'controlled', defaultValue: 'fallback' })
    expect(result.context).toStrictEqual({ value: 'controlled', defaultValue: 'fallback' })
  })

  it('omits undefined live props while preserving default*', () => {
    const result = createMachineProps(
      { value: undefined, defaultValue: 'initial' },
      { value: 'defaultValue' },
      ['value'],
    )

    expect(result.initial).toStrictEqual({ defaultValue: 'initial' })
    expect(result.context).toStrictEqual({ defaultValue: 'initial' })
  })

  it.each([false, true])('prioritizes live open=%s over a conflicting default without changing other pairs', (open) => {
    const props = Object.freeze({
      open,
      defaultOpen: !open,
      value: undefined as string | undefined,
      defaultValue: 'initial',
    })
    const result = createMachineProps(props, { open: 'defaultOpen', value: 'defaultValue' }, ['open', 'value'])

    expect(result.initial).toStrictEqual({ open, defaultValue: 'initial' })
    expect(result.context).toStrictEqual({ open, defaultValue: 'initial' })
    expect(props).toStrictEqual({ open, defaultOpen: !open, value: undefined, defaultValue: 'initial' })
  })

  for (const defaultOpen of [false, true]) {
    it.each([false, true])(`preserves defaultOpen=${defaultOpen} without acquiring live ownership (undefined key: %s)`, (includeUndefined) => {
      const props = Object.freeze({
        ...(includeUndefined ? { open: undefined } : {}),
        defaultOpen,
      })
      const result = createMachineProps(props, { open: 'defaultOpen' }, ['open'])

      expect(result.initial).toStrictEqual({ defaultOpen })
      expect(result.context).toStrictEqual({ defaultOpen })
      expect(Object.hasOwn(result.initial, 'open')).toBe(false)
      expect(Object.hasOwn(result.context, 'open')).toBe(false)
      expect(Object.hasOwn(props, 'open')).toBe(includeUndefined)
      expect(props.defaultOpen).toBe(defaultOpen)
    })
  }

  it('returns independent context copies while leaving the default seed input unchanged', () => {
    const props = Object.freeze({ defaultOpen: true })
    const result = createMachineProps(props)

    expect(result.initial).not.toBe(result.context)
    result.context.defaultOpen = false
    expect(result.initial).toStrictEqual({ defaultOpen: true })
    expect(props).toStrictEqual({ defaultOpen: true })
  })
})
