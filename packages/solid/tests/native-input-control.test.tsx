import type { JSX } from 'solid-js'
import type { UseCheckboxProps } from '../src/components/checkbox'
import type { UseRadioProps } from '../src/components/radio'
import type { UseSwitchProps } from '../src/components/switch'
import { cleanup, render, waitFor } from '@solidjs/testing-library'
import { createSignal, mergeProps } from 'solid-js'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { assertCheckboxForm } from '../../../utils/test/behavior-contracts'
import { Checkbox, useCheckbox } from '../src/components/checkbox'
import { Radio, useRadio } from '../src/components/radio'
import { Switch, useSwitch } from '../src/components/switch'

afterEach(cleanup)

const boundaries = ['root', 'provider', 'hook'] as const
type Boundary = typeof boundaries[number]

function renderToggle(kind: 'checkbox' | 'switch', boundary: Boundary, props: Pick<UseSwitchProps, 'checked' | 'defaultChecked'> & Pick<UseCheckboxProps, 'onCheckedChange'>, nativeProps: JSX.InputHTMLAttributes<HTMLInputElement> = {}) {
  const Component = kind === 'checkbox' ? Checkbox : Switch
  const useApi = kind === 'checkbox' ? useCheckbox : useSwitch
  let api!: ReturnType<typeof useApi>
  const parts = () => <><Component.Control data-testid="control" /><Component.HiddenInput {...nativeProps} /></>
  const view = render(() => {
    if (boundary === 'root') {
      return (
        <form>
          <Component.Root name="consent" value="yes" {...props}>
            <Component.Context>{(context) => {
              api = context
              return null
            }}
            </Component.Context>
            {parts()}
          </Component.Root>
        </form>
      )
    }
    api = useApi(mergeProps({ name: 'consent', value: 'yes' }, props))
    return (
      <form>
        {boundary === 'provider'
          ? kind === 'checkbox'
            ? <Checkbox.RootProvider value={api as ReturnType<typeof useCheckbox>}>{parts()}</Checkbox.RootProvider>
            : <Switch.RootProvider value={api as ReturnType<typeof useSwitch>}>{parts()}</Switch.RootProvider>
          : <><span data-testid="control" {...api().getControlProps()} /><input {...api().getHiddenInputProps()} {...nativeProps} /></>}
      </form>
    )
  })
  const input = view.container.querySelector('input')!
  const form = view.container.querySelector('form')!
  function assertState(checked: boolean) {
    expect(api().checked).toBe(checked)
    expect(input.checked).toBe(checked)
    expect(view.getByTestId('control')).toHaveAttribute('data-state', checked ? 'checked' : 'unchecked')
    expect(new FormData(form).getAll('consent')).toEqual(checked ? ['yes'] : [])
  }
  return { input, assertState }
}

function renderRadio(boundary: Boundary, props: UseRadioProps, nativeProps: JSX.InputHTMLAttributes<HTMLInputElement> = {}) {
  let api!: ReturnType<typeof useRadio>
  const parts = () => ['one', 'two'].map(value => (
    <Radio.Item value={value}>
      <Radio.ItemControl data-testid={`control-${value}`} />
      <Radio.ItemHiddenInput {...nativeProps} />
    </Radio.Item>
  ))
  const view = render(() => {
    if (boundary === 'root') {
      return (
        <form>
          <Radio.Root name="choice" {...props}>
            <Radio.Context>{(context) => {
              api = context
              return null
            }}
            </Radio.Context>
            {parts()}
          </Radio.Root>
        </form>
      )
    }
    api = useRadio(mergeProps({ name: 'choice' }, props))
    return (
      <form>
        {boundary === 'provider'
          ? <Radio.RootProvider value={api}>{parts()}</Radio.RootProvider>
          : ['one', 'two'].map(value => (
              <>
                <span data-testid={`control-${value}`} {...api().getItemControlProps({ value })} />
                <input {...api().getItemHiddenInputProps({ value })} {...nativeProps} />
              </>
            ))}
      </form>
    )
  })
  const inputs = [...view.container.querySelectorAll('input')]
  const form = view.container.querySelector('form')!
  function assertState(value: string | null) {
    expect(api().value).toBe(value)
    expect(inputs.map(input => input.checked)).toEqual(['one', 'two'].map(item => item === value))
    for (const item of ['one', 'two'])
      expect(view.getByTestId(`control-${item}`)).toHaveAttribute('data-state', item === value ? 'checked' : 'unchecked')
    expect(new FormData(form).getAll('choice')).toEqual(value === null ? [] : [value])
  }
  return { inputs, assertState }
}

describe.each(boundaries)('native controlled inputs through %s', (boundary) => {
  describe.each(['checkbox', 'switch'] as const)('%s', (kind) => {
    it.each([true, false])('restores vetoed checked=%s after every native click', async (checked) => {
      const onCheckedChange = vi.fn()
      const { input, assertState } = renderToggle(kind, boundary, { checked, onCheckedChange })
      assertState(checked)
      for (let index = 0; index < 3; index++) {
        input.click()
        await waitFor(() => assertState(checked))
        await waitFor(() => expect(onCheckedChange).toHaveBeenCalledTimes(index + 1))
        expect(onCheckedChange).toHaveBeenLastCalledWith({ checked: !checked })
        assertState(checked)
      }
    })

    it.each(['onInput', 'onChange'] as const)('lets native %s handlers accept the proposed checked value', async (eventName) => {
      const [checked, setChecked] = createSignal(true)
      const seen = vi.fn((event: Event & { currentTarget: HTMLInputElement }) => setChecked(event.currentTarget.checked))
      const { input, assertState } = renderToggle(kind, boundary, {
        get checked() { return checked() },
      }, { [eventName]: seen })
      input.click()
      await waitFor(() => assertState(false))
      input.click()
      await waitFor(() => assertState(true))
      expect(seen).toHaveBeenCalledTimes(2)
    })

    it('preserves accepted changes and subsequent clicks', async () => {
      const [checked, setChecked] = createSignal(true)
      const onCheckedChange = vi.fn((details: { checked: boolean | string }) => setChecked(details.checked === true))
      const { input, assertState } = renderToggle(kind, boundary, {
        get checked() { return checked() },
        onCheckedChange,
      })
      input.click()
      await waitFor(() => assertState(false))
      input.click()
      await waitFor(() => assertState(true))
      expect(onCheckedChange.mock.calls.map(([details]) => details.checked)).toEqual([false, true])
    })

    it('restores until a delayed parent update arrives', async () => {
      const [checked, setChecked] = createSignal(true)
      const onCheckedChange = vi.fn()
      const { input, assertState } = renderToggle(kind, boundary, {
        get checked() { return checked() },
        onCheckedChange,
      })
      input.click()
      await waitFor(() => assertState(true))
      await Promise.resolve()
      setChecked(false)
      await waitFor(() => assertState(false))
      input.click()
      await waitFor(() => assertState(false))
      expect(onCheckedChange.mock.calls.map(([details]) => details.checked)).toEqual([false, true])
    })

    it('keeps undefined live state uncontrolled', async () => {
      const { input, assertState } = renderToggle(kind, boundary, { checked: undefined, defaultChecked: true })
      input.click()
      await waitFor(() => assertState(false))
      input.click()
      await waitFor(() => assertState(true))
    })
  })

  it.each(['one', null])('restores radio value %s and the browser-unchecked sibling', async (value) => {
    const onValueChange = vi.fn()
    const { inputs, assertState } = renderRadio(boundary, { value, onValueChange })
    assertState(value)
    for (let index = 0; index < 3; index++) {
      inputs[1].click()
      await waitFor(() => assertState(value))
      await waitFor(() => expect(onValueChange).toHaveBeenCalledTimes(index + 1))
      expect(onValueChange).toHaveBeenLastCalledWith({ value: 'two' })
      assertState(value)
    }
  })

  it('preserves accepted radio changes', async () => {
    const [value, setValue] = createSignal<string | null>('one')
    const onValueChange = vi.fn((details: { value: string | null }) => setValue(details.value))
    const { inputs, assertState } = renderRadio(boundary, {
      get value() { return value() },
      onValueChange,
    })
    inputs[1].click()
    await waitFor(() => assertState('two'))
    inputs[0].click()
    await waitFor(() => assertState('one'))
    expect(onValueChange.mock.calls.map(([details]) => details.value)).toEqual(['two', 'one'])
  })

  it('restores a radio group until a delayed parent update arrives', async () => {
    const [value, setValue] = createSignal<string | null>('one')
    const onValueChange = vi.fn()
    const { inputs, assertState } = renderRadio(boundary, {
      get value() { return value() },
      onValueChange,
    })
    inputs[1].click()
    await waitFor(() => assertState('one'))
    await Promise.resolve()
    setValue('two')
    await waitFor(() => assertState('two'))
    inputs[0].click()
    await waitFor(() => assertState('two'))
    expect(onValueChange.mock.calls.map(([details]) => details.value)).toEqual(['two', 'one'])
  })

  it('keeps undefined radio value uncontrolled', async () => {
    const { inputs, assertState } = renderRadio(boundary, { value: undefined, defaultValue: 'one' })
    inputs[1].click()
    await waitFor(() => assertState('two'))
    inputs[0].click()
    await waitFor(() => assertState('one'))
  })
})

it('restores a controlled indeterminate checkbox on repeated native clicks', async () => {
  const onCheckedChange = vi.fn()
  let api!: ReturnType<typeof useCheckbox>
  const view = render(() => {
    api = useCheckbox({ checked: 'indeterminate', name: 'consent', onCheckedChange })
    return <form><input {...api().getHiddenInputProps()} /></form>
  })
  const input = view.container.querySelector('input')!
  for (let index = 0; index < 3; index++) {
    input.click()
    await Promise.resolve()
    expect(api().indeterminate).toBe(true)
    expect(input.checked).toBe(false)
    expect(input.indeterminate).toBe(true)
    expect(new FormData(view.container.querySelector('form')!).getAll('consent')).toEqual([])
  }
  expect(onCheckedChange.mock.calls.map(([details]) => details.checked)).toEqual([true, true, true])
})

it('reconciles an accepted checkbox update after a later handler cancels native activation', async () => {
  const [checked, setChecked] = createSignal(true)
  let api!: ReturnType<typeof useCheckbox>
  const view = render(() => {
    api = useCheckbox({
      get checked() { return checked() },
      onCheckedChange: details => setChecked(details.checked === true),
    })
    return (
      <input
        {...api().getHiddenInputProps()}
        onClick={(event) => {
          const onClick = api().getHiddenInputProps().onClick
          if (typeof onClick === 'function')
            onClick(event)
          event.preventDefault()
        }}
      />
    )
  })
  const input = view.container.querySelector('input')!
  input.click()
  await waitFor(() => {
    expect(api().checked).toBe(false)
    expect(input.checked).toBe(false)
  })
})

for (const boundary of boundaries) {
  it.each(['onInput', 'onChange'] as const)(`${boundary}: radio native %s can accept the proposed value`, async (eventName) => {
    const [value, setValue] = createSignal('one')
    const seen = vi.fn((event: Event & { currentTarget: HTMLInputElement }) => setValue(event.currentTarget.value))
    const { inputs, assertState } = renderRadio(boundary, {
      get value() { return value() },
    }, { [eventName]: seen })
    inputs[1].click()
    await waitFor(() => assertState('two'))
    inputs[0].click()
    await waitFor(() => assertState('one'))
    expect(seen).toHaveBeenCalledTimes(2)
  })
}

for (const boundary of boundaries) {
  it(`shared native reset: Checkbox ${boundary} restores its original seed after later defaults`, async () => {
    const [defaultChecked, setDefaultChecked] = createSignal(true)
    const { input, assertState } = renderToggle('checkbox', boundary, {
      checked: undefined,
      get defaultChecked() { return defaultChecked() },
    })
    for (let cycle = 0; cycle < 2; cycle++) {
      input.click()
      await waitFor(() => assertState(false))
      setDefaultChecked(false)
      input.form!.reset()
      await waitFor(() => {
        assertState(true)
        assertCheckboxForm(input, true)
      })
    }
  })
}
