import { mount, tick, unmount } from 'svelte'
import { afterEach, expect, it, vi } from 'vitest'
import { assertCheckboxForm, assertFocusRestored, assertOwnershipSnapshot, ownershipFields, ownershipScenarios } from '../../../../utils/test/behavior-contracts'
import { trackDocumentListeners } from '../../../../utils/test/document-listeners'
import { bindingCases, formatState } from './binding-cases'
import BindingFixture from './binding.fixture.svelte'
import DialogLifecycleFixture from './dialog-lifecycle.fixture.svelte'

// Use Svelte's native runtime here. Browser tests and supplemental DOM probes
// execute the same fixture; no cross-framework renderer or mocked hook is used.
const instances: Record<string, any>[] = []
afterEach(async () => {
  for (const instance of instances.splice(0))
    await unmount(instance)
  document.body.replaceChildren()
})

for (const name of ownershipFields) {
  const row = bindingCases.find(testCase => testCase.name.toLowerCase() === name.toLowerCase())!
  for (const scenario of ownershipScenarios) {
    it(`shared contract: ${name}: ${scenario.name}`, async () => {
      const container = document.createElement('div')
      document.body.append(container)
      const onChange = vi.fn()
      const instance = mount(BindingFixture, {
        target: container,
        props: {
          name: row.name,
          mode: scenario.accept ? 'bound' : scenario.controlled ? 'controlled' : 'uncontrolled',
          defaultState: scenario.defaultValue,
          explicitUndefined: !scenario.controlled,
          onChange,
        },
      })
      instances.push(instance)
      await tick()
      const values = { initial: row.initial(), next: row.next() }
      const format = (value: unknown) => formatState(row, value)
      const check = (value: unknown, requests: unknown[]) => vi.waitFor(() => assertOwnershipSnapshot({
        api: format(instance.readContractState()),
        rendered: container.querySelector('[data-testid="api-state"]')?.textContent,
        requests: onChange.mock.calls.map(([value]) => format(value)),
      }, format(value), requests.map(format)))
      await check(values.initial, [])
      for (const step of scenario.steps) {
        if (step.action === 'request')
          instance.requestContractState(step.value)
        if (step.action === 'parent')
          instance.writeContractParent(step.value)
        if (step.action === 'default')
          instance.updateContractDefault(step.value)
        if (step.action === 'rerender')
          instance.rerenderContract()
        await tick()
        await check(values[step.expected], step.requests.map(value => values[value]))
      }
    })
  }
}

it('shared dialog lifecycle: restores focus twice and disposes document keydown listeners on unmount', async () => {
  const onOpenChange = vi.fn()
  const container = document.createElement('div')
  document.body.append(container)
  const instance = mount(DialogLifecycleFixture, { target: container, props: { onOpenChange } })
  instances.push(instance)
  await tick()
  const trigger = container.querySelector<HTMLButtonElement>('[data-contract-trigger]')!
  const listeners = trackDocumentListeners(trigger.ownerDocument, 'keydown')
  try {
    for (const close of ['button', 'escape']) {
      trigger.focus()
      trigger.click()
      await vi.waitFor(() => expect(trigger.getAttribute('data-state')).toBe('open'))
      await vi.waitFor(() => expect(container.querySelector('[data-part="content"]')?.contains(document.activeElement)).toBe(true))
      await vi.waitFor(() => listeners.expectActive())
      if (close === 'button')
        container.querySelector<HTMLButtonElement>('[data-part="close-trigger"]')!.click()
      else
        document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      await vi.waitFor(() => {
        expect(trigger.getAttribute('data-state')).toBe('closed')
        assertFocusRestored(trigger)
        listeners.expectEmpty()
      })
    }
    trigger.click()
    await vi.waitFor(() => expect(trigger.getAttribute('data-state')).toBe('open'))
    await vi.waitFor(() => expect(container.querySelector('[data-part="content"]')?.contains(document.activeElement)).toBe(true))
    await vi.waitFor(() => listeners.expectActive())
    await unmount(instance)
    instances.splice(instances.indexOf(instance), 1)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await new Promise(resolve => setTimeout(resolve, 35))
    expect(onOpenChange.mock.calls.map(([details]) => details.open)).toEqual([true, false, true, false, true])
    await vi.waitFor(() => listeners.expectEmpty())
  }
  finally {
    listeners.restore()
  }
})

it('shared native reset: Checkbox restores its original seed after later defaults twice', async () => {
  const form = document.createElement('form')
  document.body.append(form)
  const instance = mount(BindingFixture, { target: form, props: { name: 'Checkbox.checked', mode: 'uncontrolled', explicitUndefined: true, fieldName: 'answer' } })
  instances.push(instance)
  await tick()
  const input = form.querySelector('input')!
  for (let cycle = 0; cycle < 2; cycle++) {
    input.click()
    await tick()
    await vi.waitFor(() => {
      expect(instance.readContractState()).toBe(true)
      assertCheckboxForm(input, true)
    })
    instance.updateContractDefault('next')
    await tick()
    form.reset()
    await vi.waitFor(() => {
      expect(instance.readContractState()).toBe(false)
      assertCheckboxForm(input, false)
    })
  }
})
