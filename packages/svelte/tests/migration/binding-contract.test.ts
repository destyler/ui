import type { BindingCase } from './binding-cases'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { bindingCases, formatState } from './binding-cases'
import BindingFixture from './binding.fixture.svelte'
import CheckedFixture from './checked-binding.fixture.svelte'

type BindingScreen = Awaited<ReturnType<typeof render<typeof BindingFixture>>>

async function expectState(screen: BindingScreen, testCase: BindingCase, value: unknown, ...parent: unknown[]) {
  await expect.element(screen.getByTestId('api-state')).toHaveTextContent(formatState(testCase, value))
  await expect.element(screen.getByTestId('parent-state')).toHaveTextContent(formatState(testCase, parent.length ? parent[0] : value))
  if (testCase.state === 'open') {
    await expect.element(screen.getByTestId('trigger')).toHaveAttribute('data-state', value ? 'open' : 'closed')
    if (value)
      await expect.element(screen.getByTestId('content')).toBeVisible()
    else
      await expect.element(screen.getByTestId('content')).not.toBeVisible()
  }
  if (testCase.family === 'checkbox' || testCase.family === 'switch') {
    await expect.element(screen.getByTestId('control')).toHaveAttribute('data-state', value ? 'checked' : 'unchecked')
    expect((screen.getByTestId('input').element() as HTMLInputElement).checked).toBe(value)
  }
  if (testCase.name === 'Edit.edit') {
    if (value)
      await expect.element(screen.getByTestId('input')).not.toHaveAttribute('hidden')
    else
      await expect.element(screen.getByTestId('input')).toHaveAttribute('hidden')
  }
  if (testCase.name === 'Pagination.page')
    await expect.element(screen.getByTestId(value === 1 ? 'page-one' : 'page-two')).toHaveAttribute('aria-current', 'page')
  if (testCase.name === 'NavigationMenu.value')
    await expect.element(screen.getByTestId('navigation-trigger')).toHaveAttribute('aria-expanded', String(value !== null))
  if (testCase.name === 'Tabs.value')
    await expect.element(screen.getByTestId(`tab-${value}`)).toHaveAttribute('aria-selected', 'true')
}

// Every row goes through the public Root and public Context, never an extracted
// callback. This catches a Root accidentally feeding its writable bindable local
// back into the machine instead of respecting the parent's current prop.
describe.each(bindingCases)('$name binding contract', (testCase) => {
  it.runIf(testCase.controlledVeto !== false)('keeps ordinary props controlled through repeated requests and parent writeback', async () => {
    const onChange = vi.fn()
    const screen = await render(BindingFixture, { props: { name: testCase.name, mode: 'controlled', onChange } })
    await expectState(screen, testCase, testCase.initial())
    for (let attempt = 0; attempt < 2; attempt++) {
      onChange.mockClear()
      await screen.getByTestId('request-next').click()
      if (testCase.coalescesPendingRequest && attempt > 0) {
        expect(onChange).not.toHaveBeenCalled()
      }
      else {
        await vi.waitFor(() => expect(onChange).toHaveBeenCalled())
        expect(formatState(testCase, onChange.mock.lastCall?.[0])).toBe(formatState(testCase, testCase.next()))
      }
      await expectState(screen, testCase, testCase.initial())
    }
    await screen.getByTestId('parent-next').click()
    await expectState(screen, testCase, testCase.next())
    onChange.mockClear()
    await screen.getByTestId('request-initial').click()
    await vi.waitFor(() => expect(onChange).toHaveBeenCalled())
    expect(formatState(testCase, onChange.mock.lastCall?.[0])).toBe(formatState(testCase, testCase.initial()))
    await expectState(screen, testCase, testCase.next())
    await screen.getByTestId('parent-initial').click()
    await expectState(screen, testCase, testCase.initial())
    if (testCase.coalescesPendingRequest) {
      // HoverCard coalesces an unresolved opening request until parent writeback.
      // After a complete parent-driven open/close cycle, it must request again.
      onChange.mockClear()
      await screen.getByTestId('request-next').click()
      await vi.waitFor(() => expect(onChange).toHaveBeenCalled())
      expect(formatState(testCase, onChange.mock.lastCall?.[0])).toBe(formatState(testCase, testCase.next()))
      await expectState(screen, testCase, testCase.initial())
    }
  })

  it.each(['bound', 'bound-undefined'] as const)('%s writes requests to its parent in both directions repeatedly', async (mode) => {
    const onChange = vi.fn()
    const onWrite = vi.fn()
    const screen = await render(BindingFixture, { props: { name: testCase.name, mode, onChange, onWrite } })
    if (mode !== 'bound-undefined' || testCase.hasDefault !== false)
      await expectState(screen, testCase, testCase.initial(), mode === 'bound-undefined' ? undefined : testCase.initial())
    else
      await expect.element(screen.getByTestId('parent-state')).toHaveTextContent('undefined')
    for (let cycle = 0; cycle < 2; cycle++) {
      for (const [button, value] of [['request-next', testCase.next()], ['request-initial', testCase.initial()]] as const) {
        onChange.mockClear()
        onWrite.mockClear()
        await screen.getByTestId(button).click()
        await expectState(screen, testCase, value)
        expect(formatState(testCase, onChange.mock.lastCall?.[0])).toBe(formatState(testCase, value))
        expect(formatState(testCase, onWrite.mock.lastCall?.[0])).toBe(formatState(testCase, value))
      }
    }
    await screen.getByTestId('parent-next').click()
    await expectState(screen, testCase, testCase.next())
  })

  it.runIf(testCase.controlledVeto !== false)('honors a bound parent setter that rejects a change', async () => {
    const onWrite = vi.fn()
    const onChange = vi.fn()
    const screen = await render(BindingFixture, { props: { name: testCase.name, mode: 'bound-veto', onWrite, onChange } })
    for (let attempt = 0; attempt < 2; attempt++) {
      onWrite.mockClear()
      onChange.mockClear()
      await screen.getByTestId('request-next').click()
      if (testCase.coalescesPendingRequest && attempt > 0) {
        expect(onWrite).not.toHaveBeenCalled()
        expect(onChange).not.toHaveBeenCalled()
      }
      else {
        await vi.waitFor(() => expect(onWrite).toHaveBeenCalled())
        expect(formatState(testCase, onWrite.mock.lastCall?.[0])).toBe(formatState(testCase, testCase.next()))
        expect(formatState(testCase, onChange.mock.lastCall?.[0])).toBe(formatState(testCase, testCase.next()))
      }
      await expectState(screen, testCase, testCase.initial())
    }
  })

  it.runIf(testCase.controlledVeto === false)('preserves its documented mutable core behavior and accepts subsequent parent values', async () => {
    const onChange = vi.fn()
    const screen = await render(BindingFixture, { props: { name: testCase.name, mode: 'controlled', onChange } })
    await expectState(screen, testCase, testCase.initial())
    await screen.getByTestId('request-next').click()
    await expectState(screen, testCase, testCase.next(), testCase.initial())
    expect(formatState(testCase, onChange.mock.lastCall?.[0])).toBe(formatState(testCase, testCase.next()))
    await screen.getByTestId('parent-next').click()
    await expectState(screen, testCase, testCase.next())
    await screen.getByTestId('parent-initial').click()
    await expectState(screen, testCase, testCase.initial())
  })

  it('leaves an omitted state prop interactive across unrelated rerenders', async () => {
    const onChange = vi.fn()
    const screen = await render(BindingFixture, { props: { name: testCase.name, mode: 'uncontrolled', onChange } })
    await screen.getByTestId('request-next').click()
    await expectState(screen, testCase, testCase.next(), testCase.initial())
    await screen.getByTestId('unrelated').click()
    await expectState(screen, testCase, testCase.next(), testCase.initial())
    await screen.getByTestId('request-initial').click()
    await expectState(screen, testCase, testCase.initial())
    expect(formatState(testCase, onChange.mock.lastCall?.[0])).toBe(formatState(testCase, testCase.initial()))
  })
})

type CheckedScreen = Awaited<ReturnType<typeof render<typeof CheckedFixture>>>

async function expectChecked(screen: CheckedScreen, family: string, checked: boolean) {
  await expect.element(screen.getByTestId('api-state')).toHaveTextContent(String(checked))
  if (family === 'toggle') {
    await expect.element(screen.getByTestId('toggle')).toHaveAttribute('aria-pressed', String(checked))
    await expect.element(screen.getByTestId('toggle')).toHaveAttribute('data-state', checked ? 'on' : 'off')
  }
  else {
    await expect.element(screen.getByTestId('control')).toHaveAttribute('data-state', checked ? 'checked' : 'unchecked')
    // Check the live native property, not only attributes or the Context API:
    // a canceled controlled label click must not leave the native input flipped.
    await vi.waitFor(() => expect((screen.getByTestId('input').element() as HTMLInputElement).checked).toBe(checked))
  }
}

for (const family of ['checkbox', 'switch', 'toggle'] as const) {
  describe(`${family}: real click binding`, () => {
    it.each([false, true])('honors ordinary checked/pressed=%s and reports two identical rejected requests', async (initial) => {
      const onChange = vi.fn()
      const screen = await render(CheckedFixture, { props: { family, mode: 'controlled', initial, onChange } })
      for (let attempt = 0; attempt < 2; attempt++) {
        await screen.getByTestId(family === 'toggle' ? 'toggle' : 'label').click()
        await expectChecked(screen, family, initial)
        expect(onChange).toHaveBeenNthCalledWith(attempt + 1, !initial)
        expect(onChange).toHaveBeenCalledTimes(attempt + 1)
        await expect.element(screen.getByTestId('parent-state')).toHaveTextContent(String(initial))
      }
    })

    it('keeps the API and native state when a bound setter rejects two clicks', async () => {
      const onChange = vi.fn()
      const onWrite = vi.fn()
      const screen = await render(CheckedFixture, { props: { family, mode: 'bound-veto', onChange, onWrite } })
      for (let attempt = 0; attempt < 2; attempt++) {
        await screen.getByTestId(family === 'toggle' ? 'toggle' : 'label').click()
        await expectChecked(screen, family, false)
        expect(onChange).toHaveBeenNthCalledWith(attempt + 1, true)
        expect(onWrite).toHaveBeenNthCalledWith(attempt + 1, true)
        await expect.element(screen.getByTestId('parent-state')).toHaveTextContent('false')
      }
    })

    it.each(['bound', 'bound-undefined', 'uncontrolled'] as const)('%s handles two complete click cycles', async (mode) => {
      const onChange = vi.fn()
      const screen = await render(CheckedFixture, { props: { family, mode, onChange } })
      await expectChecked(screen, family, false)
      for (let attempt = 0; attempt < 4; attempt++) {
        const checked = attempt % 2 === 0
        await screen.getByTestId(family === 'toggle' ? 'toggle' : 'label').click()
        await expectChecked(screen, family, checked)
        expect(onChange).toHaveBeenNthCalledWith(attempt + 1, checked)
        if (mode !== 'uncontrolled')
          await expect.element(screen.getByTestId('parent-state')).toHaveTextContent(String(checked))
      }
      await screen.getByTestId('unrelated').click()
      await expectChecked(screen, family, false)
    })
  })
}

describe('checkbox.Group binding', () => {
  it('keeps an ordinary group value authoritative through repeated click-uncheck requests', async () => {
    const onChange = vi.fn()
    const screen = await render(CheckedFixture, { props: { family: 'group', mode: 'controlled', initial: ['one'], onChange } })
    for (let attempt = 0; attempt < 2; attempt++) {
      await screen.getByTestId('label').click()
      await expectChecked(screen, 'group', true)
      await expect.element(screen.getByTestId('parent-state')).toHaveTextContent('["one"]')
      expect(onChange).toHaveBeenNthCalledWith(attempt + 1, [])
    }
    await screen.getByTestId('external-reset').click()
    await expectChecked(screen, 'group', false)
    await screen.getByTestId('label').click()
    await expectChecked(screen, 'group', false)
    expect(onChange).toHaveBeenLastCalledWith(['one'])
  })

  it('propagates a bound group uncheck and honors an external reselect twice', async () => {
    const onChange = vi.fn()
    const screen = await render(CheckedFixture, { props: { family: 'group', mode: 'bound', initial: ['one'], onChange } })
    for (let attempt = 0; attempt < 2; attempt++) {
      await expectChecked(screen, 'group', true)
      await screen.getByTestId('label').click()
      await expectChecked(screen, 'group', false)
      await expect.element(screen.getByTestId('parent-state')).toHaveTextContent('[]')
      expect(onChange).toHaveBeenLastCalledWith([])
      await screen.getByTestId('external-set').click()
      await expectChecked(screen, 'group', true)
      await expect.element(screen.getByTestId('parent-state')).toHaveTextContent('["one"]')
    }
  })

  it('writes a group binding initially undefined on its first click', async () => {
    const screen = await render(CheckedFixture, { props: { family: 'group', mode: 'bound-undefined', initial: [] } })
    await expect.element(screen.getByTestId('parent-state')).toHaveTextContent('undefined')
    await screen.getByTestId('label').click()
    await expectChecked(screen, 'group', true)
    await expect.element(screen.getByTestId('parent-state')).toHaveTextContent('["one"]')
    await screen.getByTestId('label').click()
    await expectChecked(screen, 'group', false)
    await expect.element(screen.getByTestId('parent-state')).toHaveTextContent('[]')
  })
})

describe('radio native input binding', () => {
  async function expectRadio(screen: CheckedScreen, selected: 'one' | 'two') {
    await expect.element(screen.getByTestId('api-state')).toHaveTextContent(selected)
    for (const value of ['one', 'two']) {
      await expect.element(screen.getByTestId(`control-${value}`)).toHaveAttribute('data-state', value === selected ? 'checked' : 'unchecked')
      await vi.waitFor(() => expect((screen.getByTestId(`input-${value}`).element() as HTMLInputElement).checked).toBe(value === selected))
    }
  }

  it.each(['controlled', 'bound-veto'] as const)('%s restores both native radio inputs after two rejected selections', async (mode) => {
    const onChange = vi.fn()
    const onWrite = vi.fn()
    const screen = await render(CheckedFixture, { props: { family: 'radio', mode, initial: 'one', onChange, onWrite } })
    for (let attempt = 0; attempt < 2; attempt++) {
      await screen.getByTestId('label-two').click()
      await expectRadio(screen, 'one')
      await expect.element(screen.getByTestId('parent-state')).toHaveTextContent('"one"')
      expect(onChange).toHaveBeenNthCalledWith(attempt + 1, 'two')
      if (mode === 'bound-veto')
        expect(onWrite).toHaveBeenNthCalledWith(attempt + 1, 'two')
    }
  })

  it.each(['bound', 'bound-undefined', 'uncontrolled'] as const)('%s changes native selection in both directions', async (mode) => {
    const screen = await render(CheckedFixture, { props: { family: 'radio', mode, initial: 'one' } })
    for (let cycle = 0; cycle < 2; cycle++) {
      for (const value of ['two', 'one'] as const) {
        await screen.getByTestId(`label-${value}`).click()
        await expectRadio(screen, value)
        if (mode !== 'uncontrolled')
          await expect.element(screen.getByTestId('parent-state')).toHaveTextContent(JSON.stringify(value))
      }
    }
  })
})
