import { resolveMachineProps } from './resolve-machine-props'

describe('resolveMachineProps', () => {
  it.each(['checked', 'open', 'value', 'inputValue', 'page', 'pageSize', 'size', 'step', 'selectedValue', 'expandedValue', 'edit'])(
    'removes an undefined own %s key before core captures ownership',
    (key) => {
      const source = { [key]: undefined }
      expect(Object.hasOwn(resolveMachineProps(source), key)).toBe(false)
      expect(Object.hasOwn(source, key)).toBe(true)
    },
  )

  it.each([false, 0, '', null, []])('preserves a defined live value %j', (value) => {
    const result = resolveMachineProps({ value })
    expect(Object.hasOwn(result, 'value')).toBe(true)
    expect(result.value).toBe(value)
  })

  it.each([false, true])('gives open %s precedence without mutating the source', (open) => {
    const source = { open, defaultOpen: !open }
    expect(resolveMachineProps(source)).toEqual({ open })
    expect(source.defaultOpen).toBe(!open)
  })

  it('retains an uncontrolled defaultOpen seed', () => {
    expect(resolveMachineProps({ open: undefined, defaultOpen: true })).toEqual({ defaultOpen: true })
  })

  it('reads fresh getters and can omit UI-only seeds', () => {
    let value = 'one'
    const props = {
      get value() {
        return value
      },
      defaultView: 'year',
    }
    expect(resolveMachineProps(props, ['defaultView'])).toEqual({ value: 'one' })
    value = 'two'
    expect(resolveMachineProps(props, ['defaultView'])).toEqual({ value: 'two' })
  })
})
