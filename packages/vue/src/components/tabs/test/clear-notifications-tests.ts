import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, nextTick } from 'vue'
import ClearNotifications from './ClearNotifications.vue'

type Mode = 'accept' | 'veto' | 'delay' | 'binding' | 'uncontrolled'
type ClearSource = 'clearValue' | 'pointer click' | 'manual Enter'
interface Interactions {
  click: (element: HTMLButtonElement) => Promise<unknown> | void
  enter: (element: HTMLButtonElement) => Promise<unknown> | void
}

const disposers: (() => void)[] = []
afterEach(() => {
  disposers.splice(0).forEach(dispose => dispose())
  document.body.replaceChildren()
})

async function settle() {
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 0))
  await nextTick()
}

function expectSelection(container: HTMLElement, value: string | null) {
  const tabs = Array.from(container.querySelectorAll<HTMLButtonElement>('[role="tab"]'))
  const panels = Array.from(container.querySelectorAll<HTMLElement>('[role="tabpanel"]'))
  expect(tabs).toHaveLength(2)
  expect(panels).toHaveLength(2)
  for (const [index, tabValue] of ['alpha', 'beta'].entries()) {
    expect(tabs[index].getAttribute('aria-selected')).toBe(String(value === tabValue))
    expect(panels[index].hidden).toBe(value !== tabValue)
  }
  expect(container.querySelector('[data-value="api"]')?.textContent).toBe(value ?? 'none')
}

export function registerClearNotificationTests(interactions: Interactions = {
  click: element => element.click(),
  enter: (element) => {
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
  },
}) {
  async function setup(mode: Mode) {
    const changes = vi.fn()
    const modelUpdates = vi.fn()
    const container = document.createElement('div')
    document.body.append(container)
    const app = createApp(ClearNotifications, { mode, onChange: changes, onModelUpdate: modelUpdates })
    app.mount(container)
    disposers.push(() => app.unmount())
    await settle()
    expectSelection(container, 'alpha')
    expect(changes).not.toHaveBeenCalled()
    expect(modelUpdates).not.toHaveBeenCalled()

    const action = async (name: string) => {
      await interactions.click(container.querySelector<HTMLButtonElement>(`[data-action="${name}"]`)!)
      await settle()
    }
    const clear = async (source: ClearSource) => {
      const alpha = container.querySelector<HTMLButtonElement>('[role="tab"]')!
      if (source === 'clearValue') {
        await action('api-clear')
      }
      else if (source === 'pointer click') {
        await interactions.click(alpha)
      }
      else {
        alpha.focus()
        await settle()
        await interactions.enter(alpha)
      }
      await settle()
    }
    const expectChanges = (values: (string | null)[]) => {
      expect(changes.mock.calls).toEqual(values.map(value => [{ value }]))
      expect(modelUpdates.mock.calls).toEqual(values.map(value => [value]))
    }
    const expectParent = (value: string | null) => {
      expect(container.querySelector('[data-value="parent"]')?.textContent).toBe(value ?? 'none')
    }
    return { container, action, clear, expectChanges, expectParent }
  }

  describe('published-core Tabs clear notifications', () => {
    const sources: ClearSource[] = ['clearValue', 'pointer click', 'manual Enter']

    it.each(sources)('accepts a controlled %s clear without echoing parent writeback', async (source) => {
      const test = await setup('accept')
      for (let attempt = 1; attempt <= 2; attempt++) {
        await test.clear(source)
        await vi.waitFor(() => {
          test.expectChanges(Array.from({ length: attempt }, () => null))
          expectSelection(test.container, null)
          test.expectParent(null)
        })
        await test.action('api-clear')
        expectSelection(test.container, null)
        test.expectChanges(Array.from({ length: attempt }, () => null))
        await test.action('parent-restore')
        await vi.waitFor(() => expectSelection(test.container, 'alpha'))
        test.expectChanges(Array.from({ length: attempt }, () => null))
      }
    })

    it.each(sources)('keeps controlled selection when the parent vetoes repeated %s clears', async (source) => {
      const test = await setup('veto')
      for (let attempt = 1; attempt <= 2; attempt++) {
        await test.clear(source)
        await vi.waitFor(() => test.expectChanges(Array.from({ length: attempt }, () => null)))
        expectSelection(test.container, 'alpha')
        test.expectParent('alpha')
      }
      await test.action('parent-clear')
      await vi.waitFor(() => expectSelection(test.container, null))
      test.expectChanges([null, null])
    })

    it.each(sources)('waits for delayed parent acceptance after repeated %s clears', async (source) => {
      const test = await setup('delay')
      for (let attempt = 1; attempt <= 2; attempt++) {
        await test.clear(source)
        await vi.waitFor(() => test.expectChanges(Array.from({ length: attempt }, () => null)))
        expectSelection(test.container, 'alpha')
        test.expectParent('alpha')
      }
      await test.action('parent-accept')
      await vi.waitFor(() => {
        expectSelection(test.container, null)
        test.expectParent(null)
      })
      await test.action('parent-accept')
      await test.action('api-clear')
      expectSelection(test.container, null)
      test.expectChanges([null, null])
    })

    it.each(sources)('accepts core-generated null through v-model after %s', async (source) => {
      const test = await setup('binding')
      await test.clear(source)
      await vi.waitFor(() => {
        test.expectChanges([null])
        expectSelection(test.container, null)
        test.expectParent(null)
      })
      await test.action('api-clear')
      expectSelection(test.container, null)
      test.expectChanges([null])
      await test.action('parent-restore')
      await vi.waitFor(() => expectSelection(test.container, 'alpha'))
      test.expectChanges([null])
    })

    it.each(sources)('clears uncontrolled selection once through %s', async (source) => {
      const test = await setup('uncontrolled')
      await test.clear(source)
      await vi.waitFor(() => {
        test.expectChanges([null])
        expectSelection(test.container, null)
      })
      await test.action('api-clear')
      test.expectChanges([null])
      expectSelection(test.container, null)
    })

    it.each<Mode>(['accept', 'binding', 'uncontrolled'])('preserves setValue(string) selection with deselectable in %s mode', async (mode) => {
      const test = await setup(mode)
      await test.action('api-alpha')
      expectSelection(test.container, 'alpha')
      test.expectChanges([])
      await test.action('api-beta')
      await vi.waitFor(() => {
        expectSelection(test.container, 'beta')
        test.expectChanges(['beta'])
      })
      await test.action('api-beta')
      expectSelection(test.container, 'beta')
      test.expectChanges(['beta'])
      await test.action('api-clear')
      await vi.waitFor(() => {
        expectSelection(test.container, null)
        test.expectChanges(['beta', null])
      })
      await test.action('api-beta')
      await vi.waitFor(() => {
        expectSelection(test.container, 'beta')
        test.expectChanges(['beta', null, 'beta'])
      })
      await test.action('api-beta')
      expectSelection(test.container, 'beta')
      test.expectChanges(['beta', null, 'beta'])
    })
  })
}
