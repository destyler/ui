import { describe, expect, it } from 'vitest'
import { createMachineProps } from '../create-machine-props'

describe('createMachineProps', () => {
  it('maps default values only into initial machine props', () => {
    const props = { value: undefined, defaultValue: 'draft', disabled: false }
    const result = createMachineProps(props, { value: 'defaultValue' })

    expect(result.initial).toStrictEqual({ value: 'draft', disabled: false })
    expect(result.context).toStrictEqual({ value: undefined, disabled: false })
    expect(props).toStrictEqual({ value: undefined, defaultValue: 'draft', disabled: false })
  })

  it('prefers an explicit controlled value over its default', () => {
    const result = createMachineProps(
      { value: 'controlled', defaultValue: 'fallback' },
      { value: 'defaultValue' },
      ['value'],
    )

    expect(result.initial).toStrictEqual({ 'value': 'controlled', 'value.controlled': true })
    expect(result.context).toStrictEqual({ 'value': 'controlled', 'value.controlled': true })
  })

  it('marks omitted values as uncontrolled while preserving their initial default', () => {
    const result = createMachineProps(
      { value: undefined, defaultValue: 'initial' },
      { value: 'defaultValue' },
      ['value'],
    )

    expect(result.initial).toStrictEqual({ 'value': 'initial', 'value.controlled': false })
    expect(result.context).toStrictEqual({ 'value': undefined, 'value.controlled': false })
  })

  it('supports multiple defaults and controlled flags independently', () => {
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
      'open': true,
      'value': 'initial',
      'open.controlled': true,
      'value.controlled': false,
    })
    expect(result.context).toStrictEqual({
      'open': true,
      'value': undefined,
      'open.controlled': true,
      'value.controlled': false,
    })
  })
})
