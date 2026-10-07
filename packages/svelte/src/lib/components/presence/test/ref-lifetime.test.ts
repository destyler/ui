import { hydrate, mount, tick, unmount } from 'svelte'
import { afterEach, describe, expect, it, vi } from 'vitest'
import PlainFixture from './PlainRefLifetimeFixture.svelte'
import childHtml from './ref-lifetime-child.ssr.html?raw'
import nativeHtml from './ref-lifetime-native.ssr.html?raw'
import Fixture from './RefLifetimeFixture.svelte'

const cleanups: (() => void | Promise<void>)[] = []

function ownTarget() {
  const target = document.createElement('div')
  document.body.append(target)
  let instance: ReturnType<typeof mount> | undefined
  const destroy = async () => {
    if (instance) {
      const current = instance
      instance = undefined
      await unmount(current)
    }
  }
  // Register before mounting or asserting so failed setup still owns cleanup.
  cleanups.push(async () => {
    try {
      await destroy()
    }
    finally {
      target.remove()
    }
  })
  const own = (value: ReturnType<typeof mount>) => {
    instance = value
  }
  return { target, own, destroy }
}

async function fixture(props: { child?: boolean, unmountOnExit?: boolean, bound?: boolean } = {}) {
  const owned = ownTarget()
  const instance = mount(Fixture, { target: owned.target, props })
  owned.own(instance)
  await tick()
  const node = () => owned.target.querySelector('[data-testid=presence-ref]')
  expect(node()).not.toBeNull()
  expect(instance.currentRef()).toBe(props.bound === false ? null : node())
  return { ...owned, instance, node }
}

afterEach(async () => {
  const errors: unknown[] = []
  for (const cleanup of cleanups.splice(0).reverse()) {
    try {
      await cleanup()
    }
    catch (error) {
      errors.push(error)
    }
  }
  if (errors.length)
    throw new AggregateError(errors, 'Presence fixture cleanup failed')
})

describe.each([false, true])('presence ref ownership with asChild=%s', (child) => {
  it.each([false, true])('clears a removed Presence ref with unmountOnExit=%s', async (unmountOnExit) => {
    const { instance, node } = await fixture({ child, unmountOnExit })
    const original = node()
    instance.hide()
    await tick()
    expect(node()).toBeNull()
    expect(original?.isConnected).toBe(false)
    expect(instance.currentRef()).toBeNull()
  })

  it('clears its ref when the complete owner is destroyed', async () => {
    const { instance, node, destroy } = await fixture({ child })
    const original = node()
    await destroy()
    expect(original?.isConnected).toBe(false)
    expect(instance.currentRef()).toBeNull()
  })

  it('preserves a settled newer caller-owned ref value', async () => {
    const { instance, node } = await fixture({ child })
    const original = node()
    const newer = document.createElement('div')
    instance.replaceRef(newer)
    // A settled handoff differs from overwriting and removing in one flush.
    await tick()
    expect(instance.currentRef()).toBe(newer)
    instance.hide()
    await tick()
    expect(node()).toBeNull()
    expect(original?.isConnected).toBe(false)
    expect(instance.currentRef()).toBe(newer)
  })

  it('matches plain bind:this when overwrite and removal share one flush', async () => {
    const plain = ownTarget()
    const control = mount(PlainFixture, { target: plain.target })
    plain.own(control)
    const { instance, node } = await fixture({ child })
    const original = node()
    expect(control.currentRef()).toBe(plain.target.querySelector('[data-testid=plain-ref]'))
    expect(control.currentRef()).not.toBeNull()
    const newer = document.createElement('div')
    control.replaceRef(newer)
    instance.replaceRef(newer)
    control.hide()
    instance.hide()
    await tick()
    expect(plain.target.querySelector('[data-testid=plain-ref]')).toBeNull()
    expect(node()).toBeNull()
    expect(original?.isConnected).toBe(false)
    // Svelte teardown reads pre-flush values. Explicitly assert the control,
    // rather than deriving the expected result from whichever behavior ran.
    expect(control.currentRef()).toBeNull()
    expect(instance.currentRef()).toBeNull()
  })

  it('keeps the node ref while Presence is merely hidden', async () => {
    const { instance, node } = await fixture({ child })
    const original = instance.currentRef()
    instance.close()
    await vi.waitFor(() => expect(node()?.hasAttribute('hidden')).toBe(true))
    expect(instance.currentRef()).toBe(original)
    expect(original?.isConnected).toBe(true)
  })

  it('clears and replaces refs through an internal exit and remount', async () => {
    const { instance, node } = await fixture({ child, unmountOnExit: true })
    const original = node()
    instance.close()
    await vi.waitFor(() => expect(node()).toBeNull())
    expect(original?.isConnected).toBe(false)
    expect(instance.currentRef()).toBeNull()
    instance.open()
    await vi.waitFor(() => expect(node()).not.toBeNull())
    await tick()
    expect(instance.currentRef()).toBe(node())
    expect(node()).not.toBe(original)
    expect(node()?.isConnected).toBe(true)
  })

  it('repeated removal and remount publish only the live node', async () => {
    const { instance, node } = await fixture({ child })
    for (let index = 0; index < 2; index++) {
      const original = node()
      instance.hide()
      await tick()
      expect(original?.isConnected).toBe(false)
      expect(instance.currentRef()).toBeNull()
      instance.show()
      await tick()
      expect(instance.currentRef()).toBe(node())
      expect(node()).not.toBe(original)
      expect(node()?.isConnected).toBe(true)
    }
  })

  it('preserves the new node across same-flush whole-owner replacement', async () => {
    const { instance, node } = await fixture({ child })
    for (let index = 0; index < 2; index++) {
      const original = node()
      instance.replaceOwner()
      await tick()
      expect(original?.isConnected).toBe(false)
      expect(node()).not.toBeNull()
      expect(node()).not.toBe(original)
      expect(node()?.isConnected).toBe(true)
      expect(instance.currentRef()).toBe(node())
    }
  })

  it('supports unbound use through hiding, removal and remount', async () => {
    const { instance, node, destroy } = await fixture({ child, bound: false })
    const original = node()
    instance.close()
    await vi.waitFor(() => expect(node()?.hasAttribute('hidden')).toBe(true))
    expect(node()).toBe(original)
    instance.hide()
    await tick()
    expect(node()).toBeNull()
    expect(original?.isConnected).toBe(false)
    instance.open()
    instance.show()
    await tick()
    expect(node()).not.toBeNull()
    expect(node()).not.toBe(original)
    expect(node()?.hasAttribute('hidden')).toBe(false)
    expect(instance.currentRef()).toBeNull()
    const replacement = node()
    await destroy()
    expect(replacement?.isConnected).toBe(false)
  })

  it('hydrates server markup in place and clears its ref on owner destruction', async () => {
    const owned = ownTarget()
    owned.target.innerHTML = child ? childHtml : nativeHtml
    const serverNode = owned.target.querySelector('[data-testid=presence-ref]')
    expect(serverNode).not.toBeNull()
    const warn = vi.spyOn(console, 'warn')
    const error = vi.spyOn(console, 'error')
    cleanups.push(() => {
      warn.mockRestore()
      error.mockRestore()
    })
    const instance = hydrate(Fixture, { target: owned.target, props: { child }, recover: false })
    owned.own(instance)
    await tick()
    expect(instance.currentRef()).toBe(serverNode)
    expect(serverNode?.isConnected).toBe(true)
    await owned.destroy()
    expect(serverNode?.isConnected).toBe(false)
    expect(instance.currentRef()).toBeNull()
    expect(warn).not.toHaveBeenCalled()
    expect(error).not.toHaveBeenCalled()
  })
})

it('replaces an asChild node without clearing its successor', async () => {
  const { instance, node } = await fixture({ child: true })
  const original = node()
  instance.replaceNode()
  await tick()
  expect(original?.isConnected).toBe(false)
  expect(instance.currentRef()).toBe(node())
  expect(node()).not.toBe(original)
  expect(node()?.isConnected).toBe(true)
  expect(node()?.getAttribute('data-generation')).toBe('1')
})

it('plain bind:this also preserves a tick-separated newer value', async () => {
  const owned = ownTarget()
  const instance = mount(PlainFixture, { target: owned.target })
  owned.own(instance)
  await tick()
  const original = instance.currentRef()
  expect(original?.isConnected).toBe(true)
  const newer = document.createElement('div')
  instance.replaceRef(newer)
  await tick()
  instance.hide()
  await tick()
  expect(original?.isConnected).toBe(false)
  expect(instance.currentRef()).toBe(newer)
})
