import type { ReactNode } from 'react'
import type { Root } from 'react-dom/client'
import { act, StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Checkbox, useCheckbox } from '~/components/checkbox'
import { Edit, useEdit } from '~/components/edit'
import { NumberInput, useNumberInput } from '~/components/number-input'
import { Radio, useRadio } from '~/components/radio'
import { Switch, useSwitch } from '~/components/switch'
import { assertCheckboxForm, assertTextSelection } from '../../../../../utils/test/behavior-contracts'

// Runs in the committed Chromium suite, and in supplemental Node DOM probes
// with the production React Compiler. Click the native inputs, not API setters.
const roots: Root[] = []
beforeEach(() => vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true))
afterEach(async () => {
  for (const root of roots.splice(0))
    await act(async () => root.unmount())
  document.body.replaceChildren()
  vi.unstubAllGlobals()
})

const entries = ['Root', 'RootProvider', 'hook'] as const
type Entry = typeof entries[number]
const controls = [
  { name: 'Checkbox', Component: Checkbox, hook: useCheckbox, field: 'checked', initial: true, next: false },
  { name: 'Switch', Component: Switch, hook: useSwitch, field: 'checked', initial: true, next: false },
  { name: 'Radio', Component: Radio, hook: useRadio, field: 'value', initial: 'one', next: 'two' },
  { name: 'NumberInput', Component: NumberInput, hook: useNumberInput, field: 'value', initial: '10', next: '25' },
  { name: 'Edit', Component: Edit, hook: useEdit, field: 'value', initial: 'alpha', next: 'beta' },
] as const

type Control = typeof controls[number]
type Value = string | boolean

async function change(action: () => void) {
  await act(async () => action())
  // Core NumberInput DOM writes use RAF. Do not mistake a transient value for
  // the settled result, and do not hold React's commit until after this wait.
  await act(async () => new Promise(resolve => setTimeout(resolve, 35)))
}

function inputText(input: HTMLInputElement, value: string, isComposing = false, caret = value.length) {
  Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!.call(input, value)
  input.setSelectionRange(caret, caret)
  input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', isComposing }))
}

async function mountControl(control: Control, entry: Entry, options: { accept?: boolean, uncontrolled?: boolean, initial?: Value, readOnly?: boolean, disabled?: boolean, formatOptions?: Intl.NumberFormatOptions } = {}) {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  roots.push(root)
  const requests = vi.fn()
  let api: any
  let setValue: (value: Value) => void = () => {}
  let replaceInput: () => void = () => {}
  const Component: any = control.Component
  const useControl: (props: any) => any = control.hook

  function capture(value: any): ReactNode {
    api = value
    return <output data-api>{String(value[control.field])}</output>
  }

  function compoundParts(key: number) {
    if (control.name === 'Radio') {
      return ['one', 'two'].map(value => (
        <Component.Item key={value} value={value}>
          <Component.ItemControl />
          <Component.ItemText>{value}</Component.ItemText>
          <Component.ItemHiddenInput key={key} />
        </Component.Item>
      ))
    }
    if (control.field === 'checked')
      return <><Component.Control /><Component.Label>{control.name}</Component.Label><Component.HiddenInput key={key} /></>
    return <><Component.Input key={key} />{control.name === 'Edit' && <Component.Preview />}</>
  }

  function HookFixture({ props, inputKey }: { props: any, inputKey: number }) {
    'use no memo'
    const value = useControl(props)
    if (entry === 'RootProvider') {
      return <Component.RootProvider value={value}>{compoundParts(inputKey)}{capture(value)}</Component.RootProvider>
    }
    return (
      <div {...value.getRootProps()}>
        {control.name === 'Radio'
          ? ['one', 'two'].map(item => (
              <label key={item} {...value.getItemProps({ value: item })}>
                <span {...value.getItemControlProps({ value: item })} />
                <input key={inputKey} {...value.getItemHiddenInputProps({ value: item })} />
              </label>
            ))
          : control.field === 'checked'
            ? <><span {...value.getControlProps()} /><input key={inputKey} {...value.getHiddenInputProps()} /></>
            : <><input key={inputKey} {...value.getInputProps()} />{control.name === 'Edit' && <span {...value.getPreviewProps()} />}</>}
        {capture(value)}
      </div>
    )
  }

  function Controller() {
    'use no memo'
    const [value, updateValue] = useState<Value>(options.initial ?? control.initial)
    const [inputKey, updateKey] = useState(0)
    setValue = updateValue
    replaceInput = () => updateKey(key => key + 1)
    const onChange = (details: any) => {
      requests(details[control.field])
      if (options.accept)
        updateValue(details[control.field])
    }
    const props = {
      name: 'field',
      readOnly: options.readOnly,
      disabled: options.disabled,
      ...(control.name === 'NumberInput' ? { formatOptions: options.formatOptions } : {}),
      [control.field]: options.uncontrolled ? undefined : value,
      [control.field === 'checked' ? 'defaultChecked' : 'defaultValue']: options.initial ?? control.initial,
      [control.field === 'checked' ? 'onCheckedChange' : 'onValueChange']: onChange,
      ...(control.name === 'Edit' ? { defaultEdit: true } : {}),
    }
    return (
      <form>
        {entry === 'Root'
          ? <Component.Root {...props}>{compoundParts(inputKey)}<Component.Context>{capture}</Component.Context></Component.Root>
          : <HookFixture props={props} inputKey={inputKey} />}
      </form>
    )
  }

  await act(async () => root.render(<StrictMode><Controller /></StrictMode>))
  return {
    container,
    requests,
    root,
    get api() { return api },
    get inputs() { return Array.from(container.querySelectorAll('input')) },
    setValue: (value: Value) => setValue(value),
    replaceInput: () => replaceInput(),
    async request(value: Value) {
      const inputs = Array.from(container.querySelectorAll('input'))
      if (control.field === 'checked') {
        await change(() => inputs[0].click())
      }
      else if (control.name === 'Radio') {
        await change(() => inputs.find(input => input.value === value)!.click())
      }
      else {
        await change(() => inputs[0].focus())
        await change(() => inputText(inputs[0], String(value)))
      }
    },
    assertValue(value: Value) {
      expect(api[control.field]).toBe(value === 'indeterminate' ? false : value)
      if (value === 'indeterminate')
        expect(api.indeterminate).toBe(true)
      expect(container.querySelector('[data-api]')?.textContent).toBe(String(value === 'indeterminate' ? false : value))
      const inputs = Array.from(container.querySelectorAll('input'))
      const formValue = new FormData(container.querySelector('form')!).get('field')
      if (control.field === 'checked') {
        expect(inputs[0].checked).toBe(value === true)
        expect(inputs[0].indeterminate).toBe(value === 'indeterminate')
        expect(container.querySelector('[data-part="control"]')?.getAttribute('data-state')).toBe(value === 'indeterminate' ? 'indeterminate' : value ? 'checked' : 'unchecked')
        expect(formValue).toBe(value === true ? 'on' : null)
      }
      else if (control.name === 'Radio') {
        expect(inputs.map(input => input.checked)).toEqual(['one', 'two'].map(item => item === value))
        expect(Array.from(container.querySelectorAll('[data-part="item-control"]')).map(item => item.getAttribute('data-state'))).toEqual(['one', 'two'].map(item => item === value ? 'checked' : 'unchecked'))
        expect(formValue).toBe(value)
      }
      else {
        expect(inputs[0].value).toBe(value)
        expect(formValue).toBe(value)
        if (control.name === 'NumberInput')
          expect(inputs[0].getAttribute('aria-valuenow')).toBe(String(Number(value)))
        else
          expect(container.querySelector('[data-part="preview"]')?.textContent).toBe(value)
      }
    },
  }
}

for (const control of controls) {
  describe(`${control.name} native reconciliation`, () => {
    for (const entry of entries) {
      it(`${entry}: repeated veto preserves API, native input, visuals and FormData`, async () => {
        const harness = await mountControl(control, entry)
        for (let index = 0; index < 3; index++) {
          await harness.request(control.next)
          harness.assertValue(control.initial)
          expect(harness.requests.mock.calls.map(([value]) => value)).toEqual(Array.from({ length: index + 1 }, () => control.next))
        }
      })

      it(`${entry}: accepted and uncontrolled native edits keep working twice`, async () => {
        for (const uncontrolled of [false, true]) {
          const harness = await mountControl(control, entry, { accept: true, uncontrolled })
          for (const value of [control.next, control.initial, control.next]) {
            await harness.request(value)
            harness.assertValue(value)
          }
          expect(harness.requests.mock.calls.map(([value]) => value)).toEqual([control.next, control.initial, control.next])
          await act(async () => harness.root.unmount())
          roots.splice(roots.indexOf(harness.root), 1)
        }
      })

      it(`${entry}: delayed acceptance replaces the vetoed state`, async () => {
        const harness = await mountControl(control, entry)
        await harness.request(control.next)
        harness.assertValue(control.initial)
        await change(() => harness.setValue(control.next))
        harness.assertValue(control.next)
        await harness.request(control.initial)
        harness.assertValue(control.next)
        expect(harness.requests.mock.calls.map(([value]) => value)).toEqual([control.next, control.initial])
      })
    }
  })
}

for (const entry of entries) {
  it(`${entry}: restores indeterminate state cleared by the native checkbox click`, async () => {
    const harness = await mountControl(controls[0], entry, { initial: 'indeterminate' })
    for (let index = 0; index < 2; index++) {
      await harness.request(true)
      harness.assertValue('indeterminate')
    }
    expect(harness.requests.mock.calls).toEqual([[true], [true]])
  })

  for (const control of controls.filter(control => control.name === 'NumberInput' || control.name === 'Edit')) {
    it(`${control.name} ${entry}: accepted text retains the caret`, async () => {
      const harness = await mountControl(control, entry, { accept: true })
      const input = harness.inputs[0]
      await change(() => input.focus())
      await change(() => inputText(input, control.name === 'Edit' ? 'abeta' : '125', false, 1))
      expect(input.selectionStart).toBe(1)
      expect(input.selectionEnd).toBe(1)
      harness.assertValue(control.name === 'Edit' ? 'abeta' : '125')
    })

    it(`${control.name} ${entry}: composition survives rejection and parent updates until compositionend`, async () => {
      const harness = await mountControl(control, entry)
      const input = harness.inputs[0]
      const composingText = control.name === 'Edit' ? '日本' : '12'
      await change(() => input.focus())
      await change(() => {
        input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
        inputText(input, composingText, true, 1)
      })
      assertTextSelection(input, composingText, 1)
      await change(() => harness.setValue(control.next))
      assertTextSelection(input, composingText, 1)
      await change(() => input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: composingText })))
      harness.assertValue(control.next)
    })

    it(`${control.name} ${entry}: final composition input is accepted without stale reconciliation`, async () => {
      const harness = await mountControl(control, entry, { accept: true })
      const input = harness.inputs[0]
      await change(() => input.focus())
      await change(() => {
        input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
        inputText(input, String(control.next), true, 1)
      })
      expect(input.value).toBe(control.next)
      await change(() => {
        input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: String(control.next) }))
        inputText(input, String(control.next), false, 1)
      })
      harness.assertValue(control.next)
      expect(input.selectionStart).toBe(1)
    })

    it(`${control.name} ${entry}: replaced or unmounted nodes do not receive queued reconciliation`, async () => {
      const harness = await mountControl(control, entry)
      const oldInput = harness.inputs[0]
      await change(() => oldInput.focus())
      await change(() => {
        inputText(oldInput, String(control.next))
        harness.replaceInput()
      })
      expect(harness.inputs[0]).not.toBe(oldInput)
      expect(oldInput.isConnected).toBe(false)
      harness.assertValue(control.initial)
      await harness.request(control.next)
      harness.assertValue(control.initial)
      await change(() => {
        inputText(harness.inputs[0], String(control.next))
        harness.root.unmount()
      })
      roots.splice(roots.indexOf(harness.root), 1)
    })
  }

  it(`NumberInput ${entry}: accepted partial numbers retain raw text and caret`, async () => {
    const harness = await mountControl(controls[3], entry, { accept: true })
    const input = harness.inputs[0]
    await change(() => input.focus())
    for (const value of ['1.', '1.2']) {
      await change(() => inputText(input, value))
      assertTextSelection(input, value, value.length)
      expect(harness.requests).toHaveBeenLastCalledWith(value)
    }
  })
}

it('numberInput: a queued parent write cannot overwrite a newly started composition', async () => {
  const harness = await mountControl(controls[3], 'hook')
  const input = harness.inputs[0]
  await change(() => input.focus())
  await act(async () => harness.setValue('25'))
  await change(() => {
    input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
    inputText(input, '12', true, 1)
  })
  expect(input.value).toBe('12')
  expect(input.selectionStart).toBe(1)
  await change(() => input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true })))
  harness.assertValue('25')
})

for (const control of controls.filter(control => ['Checkbox', 'Switch', 'Radio'].includes(control.name))) {
  for (const entry of entries) {
    it(`${control.name} ${entry}: disabled and readOnly native clicks cannot change state`, async () => {
      for (const option of ['readOnly', 'disabled']) {
        const harness = await mountControl(control, entry, { [option]: true })
        for (let index = 0; index < 2; index++)
          await harness.request(control.next)
        expect(harness.api[control.field]).toBe(control.initial)
        expect(harness.inputs.map(input => input.checked)).toEqual(control.name === 'Radio' ? [true, false] : [true])
        expect(harness.requests).not.toHaveBeenCalled()
        const values = new FormData(harness.container.querySelector('form')!).get('field')
        expect(values).toBe(option === 'disabled' ? null : control.name === 'Radio' ? 'one' : 'on')
      }
    })
  }
}

const formats = [
  { name: 'currency', options: { style: 'currency', currency: 'USD' }, initial: '$10.00', proposal: '$25.00', partial: '1.', committed: '$1.00' },
  { name: 'decimal', options: { minimumFractionDigits: 2 }, initial: '10.00', proposal: '25.00', partial: '1.', committed: '1.00' },
] satisfies { name: string, options: Intl.NumberFormatOptions, initial: string, proposal: string, partial: string, committed: string }[]

for (const entry of entries) {
  for (const format of formats) {
    it(`NumberInput ${entry}: vetoed ${format.name} input restores display formatting on blur and Enter`, async () => {
      const harness = await mountControl(controls[3], entry, { formatOptions: format.options })
      const input = harness.inputs[0]
      expect(input.value).toBe(format.initial)
      for (const commit of ['blur', 'Enter']) {
        await change(() => input.focus())
        await change(() => inputText(input, format.proposal))
        expect(harness.requests).toHaveBeenLastCalledWith(format.proposal)
        expect(harness.api.value).toBe(format.initial)
        // Native editing keeps core's raw representation; leaving editing or
        // committing it must restore the configured display even after veto.
        await change(() => commit === 'blur' ? input.blur() : input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })))
        expect(input.value).toBe(format.initial)
        expect(harness.api.value).toBe(format.initial)
        expect(new FormData(harness.container.querySelector('form')!).get('field')).toBe(format.initial)
      }
    })

    it(`NumberInput ${entry}: accepted ${format.name} partial text retains caret until blur`, async () => {
      const harness = await mountControl(controls[3], entry, { formatOptions: format.options, accept: true })
      const input = harness.inputs[0]
      await change(() => input.focus())
      await change(() => inputText(input, format.partial, false, 1))
      expect(input.value).toBe(format.partial)
      expect(input.selectionStart).toBe(1)
      expect(harness.requests).toHaveBeenLastCalledWith(format.partial)
      await change(() => input.blur())
      expect(input.value).toBe(format.committed)
      expect(harness.api.value).toBe(format.committed)
    })
  }
}

for (const entry of entries) {
  it(`shared native reset: Checkbox ${entry} restores native input, API and FormData twice`, async () => {
    const harness = await mountControl(controls[0], entry, { uncontrolled: true })
    for (let cycle = 0; cycle < 2; cycle++) {
      await harness.request(false)
      harness.assertValue(false)
      await change(() => harness.inputs[0].form!.reset())
      harness.assertValue(true)
      assertCheckboxForm(harness.inputs[0], true)
    }
  })
}
