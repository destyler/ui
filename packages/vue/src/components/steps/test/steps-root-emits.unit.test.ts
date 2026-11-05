import type { Component, VNode } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick, ref, shallowRef } from 'vue'
import Controlled from '../examples/Controlled.vue'
import { Steps } from '../index'

const cleanups: Array<() => void> = []
afterEach(() => cleanups.splice(0).forEach(cleanup => cleanup()))

function mount(render: () => VNode) {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render })
  app.mount(host)
  let mounted = true
  const cleanup = () => {
    if (mounted)
      app.unmount()
    mounted = false
    host.remove()
  }
  cleanups.push(cleanup)
  return { host, cleanup }
}

function parts(control?: { component: Component, props: Record<string, unknown> }) {
  return [
    h(Steps.List, () => [0, 1, 2].map(index => h(Steps.Item, { index }, () => h(Steps.Trigger, {
      'data-testid': `step-${index}`,
      ...(control?.component === Steps.Trigger && index === 2 ? control.props : {}),
    }, () => `Step ${index}`)))),
    ...[0, 1, 2].map(index => h(Steps.Content, { index, 'data-testid': `content-${index}` }, () => `Content ${index}`)),
    h(Steps.CompletedContent, { 'data-testid': 'completed' }, () => 'Complete'),
    h(Steps.PrevTrigger, {
      'data-testid': 'previous',
      ...(control?.component === Steps.PrevTrigger ? control.props : {}),
    }, () => 'Previous'),
    h(Steps.NextTrigger, {
      'data-testid': 'next',
      ...(control?.component === Steps.NextTrigger ? control.props : {}),
    }, () => 'Next'),
  ]
}

async function flush() {
  await nextTick()
  await nextTick()
}

async function click(host: HTMLElement, id: string) {
  const button = host.querySelector<HTMLButtonElement>(`[data-testid="${id}"]`)
  expect(button).not.toBeNull()
  button!.click()
  await flush()
}

function expectStep(host: HTMLElement, step: number) {
  for (const index of [0, 1, 2]) {
    expect(host.querySelector<HTMLDivElement>(`[data-testid="content-${index}"]`)!.hidden).toBe(index !== step)
    expect(host.querySelector(`[data-testid="step-${index}"]`)!.getAttribute('aria-selected')).toBe(String(index === step))
  }
  expect(host.querySelector<HTMLDivElement>('[data-testid="completed"]')!.hidden).toBe(step !== 3)
}

describe('steps Root event bridge with compiled components', () => {
  it('delivers numeric update:modelValue independently of the stepChange listener', async () => {
    const updated = vi.fn()
    const { host } = mount(() => h(Steps.Root, { 'count': 3, 'onUpdate:modelValue': updated }, () => parts()))
    await click(host, 'next')
    expectStep(host, 1)
    expect(updated.mock.calls).toEqual([[1]])
    await click(host, 'previous')
    expectStep(host, 0)
    expect(updated.mock.calls).toEqual([[1], [0]])
  })

  it('delivers uncontrolled stepChange details and model updates exactly once, in order', async () => {
    const changed = vi.fn()
    const updated = vi.fn()
    const order: string[] = []
    const { host } = mount(() => h(Steps.Root, {
      'count': 3,
      'defaultStep': 1,
      'onStepChange': (details) => {
        changed(details)
        order.push(`change:${details.step}`)
      },
      'onUpdate:modelValue': (value) => {
        updated(value)
        order.push(`model:${value}`)
      },
    }, () => parts()))
    expectStep(host, 1)
    expect(changed).not.toHaveBeenCalled()
    expect(updated).not.toHaveBeenCalled()
    await click(host, 'step-1')
    expect(changed).not.toHaveBeenCalled()
    await click(host, 'next')
    expectStep(host, 2)
    expect(changed.mock.calls).toEqual([[{ step: 2 }]])
    expect(updated.mock.calls).toEqual([[2]])
    await click(host, 'previous')
    await click(host, 'step-0')
    await click(host, 'next')
    expectStep(host, 1)
    expect(changed.mock.calls).toEqual([[{ step: 2 }], [{ step: 1 }], [{ step: 0 }], [{ step: 1 }]])
    expect(updated.mock.calls).toEqual([[2], [1], [0], [1]])
    expect(order).toEqual(['change:2', 'model:2', 'change:1', 'model:1', 'change:0', 'model:0', 'change:1', 'model:1'])
  })

  it('emits completion without a payload once per transition to the completed step', async () => {
    const complete = vi.fn()
    const { host } = mount(() => h(Steps.Root, { count: 3, defaultStep: 2, onStepComplete: complete }, () => parts()))
    expectStep(host, 2)
    expect(complete).not.toHaveBeenCalled()
    await click(host, 'next')
    expectStep(host, 3)
    expect(complete.mock.calls).toEqual([[]])
    expect(host.querySelector<HTMLButtonElement>('[data-testid="next"]')!.disabled).toBe(true)
    await click(host, 'next')
    expect(complete).toHaveBeenCalledTimes(1)
    await click(host, 'previous')
    expectStep(host, 2)
    await click(host, 'next')
    expectStep(host, 3)
    expect(complete.mock.calls).toEqual([[], []])
  })

  it('keeps controlled requests pending until accepted and allows the parent to veto later requests', async () => {
    const step = ref(1)
    const changed = vi.fn()
    const updated = vi.fn()
    const { host } = mount(() => h(Steps.Root, {
      'count': 3,
      'modelValue': step.value,
      'onStepChange': changed,
      'onUpdate:modelValue': updated,
    }, () => parts()))
    await click(host, 'next')
    await click(host, 'next')
    expectStep(host, 1)
    expect(step.value).toBe(1)
    expect(changed.mock.calls).toEqual([[{ step: 2 }], [{ step: 2 }]])
    expect(updated.mock.calls).toEqual([[2], [2]])
    step.value = 2
    await flush()
    expectStep(host, 2)
    expect(updated).toHaveBeenCalledTimes(2)
    await click(host, 'previous')
    expectStep(host, 2)
    expect(updated.mock.calls).toEqual([[2], [2], [1]])
    expect(changed.mock.calls).toEqual([[{ step: 2 }], [{ step: 2 }], [{ step: 1 }]])
    step.value = 0
    await flush()
    expectStep(host, 0)
    expect(changed).toHaveBeenCalledTimes(3)
    expect(updated).toHaveBeenCalledTimes(3)
  })

  it('bridges the compiled v-model example through repeated next, previous and completion actions', async () => {
    const { host } = mount(() => h(Controlled))
    const clickPart = async (part: string) => {
      host.querySelector<HTMLButtonElement>(`[data-part="${part}"]`)!.click()
      await flush()
    }
    expect(host.querySelector('output')!.textContent).toBe('Step 0')
    await clickPart('next-trigger')
    expect(host.querySelector('output')!.textContent).toBe('Step 1')
    expect(host.querySelector('[data-part="trigger"][aria-selected="true"]')!.textContent).toContain('Second')
    await clickPart('prev-trigger')
    expect(host.querySelector('output')!.textContent).toBe('Step 0')
    for (let index = 0; index < 3; index++)
      await clickPart('next-trigger')
    expect(host.querySelector('output')!.textContent).toBe('Step 3')
    expect([...host.querySelectorAll<HTMLDivElement>('[data-part="content"]')].filter(content => !content.hidden).map(content => content.textContent)).toEqual(['Steps Complete - Thank you for filling out the form!'])
  })

  it('uses replacement Root listeners and removes the mounted owner without disturbing siblings', async () => {
    const oldListener = vi.fn()
    const newListener = vi.fn()
    const listener = shallowRef(oldListener)
    const sibling = document.createElement('aside')
    document.body.append(sibling)
    cleanups.push(() => sibling.remove())
    const { host, cleanup } = mount(() => h(Steps.Root, { count: 3, onStepChange: listener.value }, () => parts()))
    await click(host, 'next')
    expect(oldListener).toHaveBeenCalledExactlyOnceWith({ step: 1 })
    listener.value = newListener
    await flush()
    await click(host, 'next')
    expectStep(host, 2)
    expect(oldListener).toHaveBeenCalledTimes(1)
    expect(newListener).toHaveBeenCalledExactlyOnceWith({ step: 2 })
    cleanup()
    expect(host.isConnected).toBe(false)
    expect(sibling.isConnected).toBe(true)
  })
})

const controls = [
  { name: 'Trigger', component: Steps.Trigger, id: 'step-2', result: 2 },
  { name: 'NextTrigger', component: Steps.NextTrigger, id: 'next', result: 2 },
  { name: 'PrevTrigger', component: Steps.PrevTrigger, id: 'previous', result: 0 },
]

it.each(controls)('$name caller preventDefault vetoes the real machine transition, then allows a replacement listener', async (control) => {
  const canceled = vi.fn((event: MouseEvent) => event.preventDefault())
  const allowed = vi.fn()
  const listener = shallowRef<(event: MouseEvent) => void>(canceled)
  const { host } = mount(() => h(Steps.Root, { count: 3, defaultStep: 1 }, () => parts({
    component: control.component,
    props: { onClick: listener.value },
  })))
  await click(host, control.id)
  expect(canceled).toHaveBeenCalledTimes(1)
  // DOM and aria state prove cancellation independently of Root's event bridge.
  expectStep(host, 1)
  listener.value = allowed
  await flush()
  await click(host, control.id)
  expectStep(host, control.result)
  expect(canceled).toHaveBeenCalledTimes(1)
  expect(allowed).toHaveBeenCalledTimes(1)
})
