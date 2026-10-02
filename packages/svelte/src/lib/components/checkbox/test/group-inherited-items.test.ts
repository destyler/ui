import { flushSync, mount, tick, unmount } from 'svelte'
import { expect, it } from 'vitest'
import Fixture from './GroupInheritedItemsFixture.svelte'

it('preserves normalized one-argument props while resolving each item Field independently', async () => {
  const target = document.createElement('div')
  document.body.append(target)
  const app = mount(Fixture, { target })
  const settle = async () => {
    for (let turn = 0; turn < 4; turn++) {
      await tick()
      flushSync()
    }
  }
  const flags = (name: string) => target.querySelector(`[data-testid="${name}-flags"]`)!.textContent
  const entries = () => Array.from(new FormData(target.querySelector('form')!).entries())
  try {
    await settle()
    const inputs = Array.from(target.querySelectorAll<HTMLInputElement>('input'))
    expect(inputs).toHaveLength(2)
    expect(inputs.map(input => input.disabled)).toEqual([true, false])
    expect(inputs.map(input => input.closest('[data-scope="checkbox"][data-part="root"]')!.hasAttribute('data-readonly'))).toEqual([true, false])
    expect(inputs.map(input => input.getAttribute('aria-invalid'))).toEqual(['true', 'false'])
    expect(entries()).toEqual([['answer', 'two']])
    expect(flags('direct')).toBe('[false,false,false]')
    expect(flags('mapped')).toBe('[false,false]')
    expect(target.querySelector('[data-testid="arity"]')!.textContent).toBe('1')
    expect(flags('inherited')).toBe('[true,true,true]')
    expect(flags('group')).toBe('[false,false,false]')
    flushSync(() => app.update({ first: false }))
    await settle()
    expect(inputs.map(input => input.disabled)).toEqual([false, true])
    expect(inputs.map(input => input.closest('[data-scope="checkbox"][data-part="root"]')!.hasAttribute('data-readonly'))).toEqual([false, true])
    expect(inputs.map(input => input.getAttribute('aria-invalid'))).toEqual(['false', 'true'])
    expect(entries()).toEqual([['answer', 'one']])
    flushSync(() => app.update({ first: false, group: false }))
    await settle()
    expect(inputs.map(input => input.disabled)).toEqual([false, false])
    expect(inputs.map(input => input.closest('[data-scope="checkbox"][data-part="root"]')!.hasAttribute('data-readonly'))).toEqual([false, false])
    expect(inputs.map(input => input.getAttribute('aria-invalid'))).toEqual(['false', 'false'])
    expect(flags('inherited')).toBe('[false,false,false]')
    expect(entries()).toEqual([['answer', 'one'], ['answer', 'two']])
    flushSync(() => app.update({ first: true, group: true, localOverride: true }))
    await settle()
    expect(inputs.map(input => input.disabled)).toEqual([false, true])
    expect(inputs.map(input => input.closest('[data-scope="checkbox"][data-part="root"]')!.hasAttribute('data-readonly'))).toEqual([false, true])
    expect(inputs.map(input => input.getAttribute('aria-invalid'))).toEqual(['false', 'true'])
    expect(flags('direct')).toBe('[true,true,true]')
    expect(flags('mapped')).toBe('[true,true]')
    expect(flags('group')).toBe('[true,true,true]')
    expect(entries()).toEqual([['answer', 'one']])
    for (const [index, input] of Array.from(target.querySelectorAll('input')).entries())
      expect(input).toBe(inputs[index])
    expect(target.querySelectorAll('input')).toHaveLength(2)
  }
  finally {
    await unmount(app)
    target.remove()
  }
})

it.each([
  { label: 'zero', value: 0 },
  { label: 'one', value: 1 },
  { label: 'empty string', value: '' },
  { label: 'nonempty string', value: 'yes' },
  { label: 'array', value: [] },
  { label: 'object', value: {} },
])('retains Boolean normalization for $label JavaScript options', async ({ value }) => {
  const target = document.createElement('div')
  document.body.append(target)
  const app = mount(Fixture, { target })
  try {
    const options: { first: boolean, group?: boolean } = { first: false }
    // Deliberately exercise an untyped JavaScript caller without broadening the
    // public TypeScript interface or coercing the value in the fixture.
    Reflect.set(options, 'group', value)
    flushSync(() => app.update(options))
    for (let turn = 0; turn < 4; turn++) {
      await tick()
      flushSync()
    }
    const expected = JSON.stringify([Boolean(value), Boolean(value), Boolean(value)])
    expect(target.querySelector('[data-testid="direct-flags"]')!.textContent).toBe(expected)
    expect(target.querySelector('[data-testid="group-flags"]')!.textContent).toBe(expected)
    expect(target.querySelector('[data-testid="mapped-flags"]')!.textContent).toBe(JSON.stringify([Boolean(value), Boolean(value)]))
  }
  finally {
    await unmount(app)
    target.remove()
  }
})
