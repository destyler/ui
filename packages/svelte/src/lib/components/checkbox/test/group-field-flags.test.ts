import type { Options } from './GroupFieldFixture.svelte'
import { flushSync, mount, tick, unmount } from 'svelte'
import { describe, expect, it } from 'vitest'
import Fixture from './GroupFieldFixture.svelte'

function setup(initial: Options) {
  const target = document.createElement('div')
  document.body.append(target)
  const component = mount(Fixture, { target, props: { initial } })
  flushSync()
  return {
    target,
    input: () => target.querySelector<HTMLInputElement>('input')!,
    root: () => target.querySelector<HTMLElement>('[data-scope="checkbox"][data-part="root"]')!,
    entries: () => Array.from(new FormData(target.querySelector('form')!).entries()),
    async update(options: Options) {
      flushSync(() => component.update(options))
      for (let turn = 0; turn < 4; turn++) {
        await tick()
        flushSync()
      }
    },
    async dispose() {
      await unmount(component)
      target.remove()
    },
  }
}

function assertFlags(fixture: ReturnType<typeof setup>, expected: { disabled?: boolean, readOnly?: boolean, invalid?: boolean }) {
  expect(fixture.input().disabled).toBe(!!expected.disabled)
  expect(fixture.root().hasAttribute('data-disabled')).toBe(!!expected.disabled)
  expect(fixture.root().hasAttribute('data-readonly')).toBe(!!expected.readOnly)
  expect(fixture.input().getAttribute('aria-invalid')).toBe(expected.invalid ? 'true' : 'false')
}

describe('checkbox group inherited flags', () => {
  it.each(['disabled', 'readOnly', 'invalid'] as const)('inherits omitted %s through the actual Field', async (flag) => {
    const fixture = setup({ field: { [flag]: true } })
    try {
      assertFlags(fixture, { [flag]: true })
      expect(fixture.entries()).toEqual(flag === 'disabled' ? [] : [['answer', 'alpha']])
      const input = fixture.input()
      const label = fixture.target.querySelector<HTMLLabelElement>('[data-scope="field"][data-part="label"]')!
      expect(label.htmlFor).toBe(input.id)
      expect(input.getAttribute('aria-labelledby')).toBe(label.id)
      await fixture.update({ field: { [flag]: false } })
      expect(fixture.input()).toBe(input)
      assertFlags(fixture, {})
    }
    finally { await fixture.dispose() }
  })

  it.each(['disabled', 'readOnly', 'invalid'] as const)('preserves explicit group false and true for %s', async (flag) => {
    const fixture = setup({ field: { [flag]: true }, group: { [flag]: false } })
    try {
      assertFlags(fixture, {})
      const input = fixture.input()
      await fixture.update({ field: { [flag]: false }, group: { [flag]: true } })
      assertFlags(fixture, { [flag]: true })
      expect(fixture.input()).toBe(input)
      await fixture.update({ field: { [flag]: true }, group: { [flag]: undefined } })
      assertFlags(fixture, { [flag]: true })
      await fixture.update({ field: { [flag]: false } })
      assertFlags(fixture, {})
    }
    finally { await fixture.dispose() }
  })

  it('follows Fieldset inheritance, required state and exact form participation', async () => {
    const fixture = setup({ fieldsetDisabled: true, field: { required: true } })
    try {
      assertFlags(fixture, { disabled: true })
      expect(fixture.input().required).toBe(true)
      expect(fixture.entries()).toEqual([])
      const input = fixture.input()
      await fixture.update({ fieldsetDisabled: false, field: { required: false }, group: { name: 'renamed' } })
      expect(fixture.input()).toBe(input)
      assertFlags(fixture, {})
      expect(input.required).toBe(false)
      expect(fixture.entries()).toEqual([['renamed', 'alpha']])
      await fixture.update({ fieldsetDisabled: true, visible: false })
      expect(input.isConnected).toBe(false)
      await fixture.update({ fieldsetDisabled: true })
      expect(fixture.input()).not.toBe(input)
      assertFlags(fixture, { disabled: true })
    }
    finally { await fixture.dispose() }
  })

  it('retains local item overrides and standalone defaults', async () => {
    const fixture = setup({ field: { disabled: true, readOnly: true, invalid: true }, item: { disabled: false, readOnly: false, invalid: false } })
    try {
      assertFlags(fixture, {})
      expect(fixture.entries()).toEqual([['answer', 'alpha']])
      await fixture.update({ grouped: false, field: { disabled: true, readOnly: true, invalid: true } })
      assertFlags(fixture, { disabled: true, readOnly: true, invalid: true })
    }
    finally { await fixture.dispose() }
  })
})
