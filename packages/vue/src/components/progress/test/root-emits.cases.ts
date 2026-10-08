import type { App } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { createApp, nextTick } from 'vue'
import ControlledWriteback from './ControlledWriteback.vue'
import ParentWriteback from './ParentWriteback.vue'
import ProviderWriteback from './ProviderWriteback.vue'

let app: App | undefined
let mountedHost: HTMLElement | undefined

function cleanup() {
  try {
    app?.unmount()
  }
  finally {
    app = undefined
    mountedHost?.remove()
    mountedHost = undefined
  }
}

afterEach(cleanup)

function mount(component = ParentWriteback) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  mountedHost = host
  app = createApp(component)
  app.mount(host)
  return host
}

async function click(host: HTMLElement, selector: string) {
  const button = host.querySelector<HTMLButtonElement>(selector)
  expect(button).not.toBeNull()
  button!.click()
  await nextTick()
  await nextTick()
}

const parent = (host: HTMLElement) => host.querySelector('[data-testid="parent-value"]')?.textContent
const changes = (host: HTMLElement) => host.querySelector('[data-testid="change-events"]')?.textContent
const valueText = (host: HTMLElement) => host.querySelector('[data-part="value-text"]')?.textContent

describe('progress Root event bridge', () => {
  it('removes only its own host when the owner is disposed', () => {
    const sentinel = document.createElement('aside')
    sentinel.textContent = 'unrelated owner'
    document.body.appendChild(sentinel)
    try {
      const host = mount()
      cleanup()
      expect(host.isConnected).toBe(false)
      expect(sentinel.isConnected).toBe(true)
      expect(sentinel.textContent).toBe('unrelated owner')
    }
    finally {
      sentinel.remove()
    }
  })

  it('keeps RootProvider and the public hook callback path working through parent changes', async () => {
    const host = mount(ProviderWriteback)
    await click(host, '[data-action="parent"]')
    expect(parent(host)).toBe('80')
    expect(valueText(host)).toBe('80%')
    expect(changes(host)).toBe('[]')
    for (const action of ['zero', 'null', 'set'])
      await click(host, `[data-action="${action}"]`)
    expect(parent(host)).toBe('65')
    expect(valueText(host)).toBe('65%')
    expect(changes(host)).toBe('[{"value":0},{"value":null},{"value":65}]')
  })

  it('preserves the existing local-render control independently of parent writeback', async () => {
    const host = mount(ControlledWriteback)
    const button = [...host.querySelectorAll<HTMLButtonElement>('button')].find(button => button.textContent?.includes('api-set-65'))
    expect(button).toBeDefined()
    button!.click()
    await nextTick()
    await nextTick()
    expect(valueText(host)).toBe('65%')
  })

  it('writes api requests to the parent v-model and emits exactly one valueChange', async () => {
    const host = mount()
    expect(parent(host)).toBe('42')
    await click(host, '[data-action="set"]')
    expect(parent(host)).toBe('65')
    expect(changes(host)).toBe('[{"value":65}]')
    expect(valueText(host)).toBe('65%')
    expect(host.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')).toBe('65')
  })

  it('forwards a zero request without falling back to a previous parent value', async () => {
    const host = mount()
    await click(host, '[data-action="zero"]')
    expect(parent(host)).toBe('0')
    expect(changes(host)).toBe('[{"value":0}]')
    expect(valueText(host)).toBe('0%')
    await click(host, '[data-action="set"]')
    expect(parent(host)).toBe('65')
    expect(changes(host)).toBe('[{"value":0},{"value":65}]')
  })

  it('forwards null to the parent and reflects indeterminate metadata', async () => {
    const host = mount()
    await click(host, '[data-action="null"]')
    expect(parent(host)).toBe('null')
    expect(changes(host)).toBe('[{"value":null}]')
    expect(host.querySelector('[data-part="root"]')?.getAttribute('data-state')).toBe('indeterminate')
    expect(host.querySelector('[role="progressbar"]')?.hasAttribute('aria-valuenow')).toBe(false)
  })

  it('does not emit for parent-only writes or requests equal to current value', async () => {
    const host = mount()
    await click(host, '[data-action="same"]')
    expect(changes(host)).toBe('[]')
    await click(host, '[data-action="parent"]')
    expect(parent(host)).toBe('80')
    expect(valueText(host)).toBe('80%')
    expect(changes(host)).toBe('[]')
    await click(host, '[data-action="set"]')
    expect(parent(host)).toBe('65')
    expect(changes(host)).toBe('[{"value":65}]')
    await click(host, '[data-action="same"]')
    expect(changes(host)).toBe('[{"value":65}]')
  })
})
