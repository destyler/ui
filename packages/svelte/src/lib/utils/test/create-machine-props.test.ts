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

  it('supports multiple controllable pairs via pass-through', () => {
    const result = createMachineProps(
      {
        open: true,
        defaultOpen: false,
        value: undefined as string | undefined,
        defaultValue: 'initial',
      },
      { open: 'defaultOpen', value: 'defaultValue' },
      ['open', 'value'],
    )

    expect(result.initial).toStrictEqual({
      open: true,
      defaultOpen: false,
      defaultValue: 'initial',
    })
    expect(result.context).toStrictEqual({
      open: true,
      defaultOpen: false,
      defaultValue: 'initial',
    })
  })
})
