import { flushSync, hydrate, tick, unmount } from 'svelte'
import { expect, it, vi } from 'vitest'
import serverHtml from './group-field-flags.ssr.html?raw'
import Fixture from './GroupFieldFixture.svelte'

it('hydrates the genuine server markup without replacing the input or losing inherited flags', async () => {
  const target = document.createElement('div')
  target.innerHTML = serverHtml
  document.body.append(target)
  const input = target.querySelector<HTMLInputElement>('input')!
  const errors = vi.spyOn(console, 'error')
  const warnings = vi.spyOn(console, 'warn')
  const app = hydrate(Fixture, { target, props: { initial: { field: { disabled: true, readOnly: true, invalid: true, required: true } } }, recover: false })
  try {
    for (let turn = 0; turn < 4; turn++) {
      await tick()
      flushSync()
    }
    expect(target.querySelectorAll('input')).toHaveLength(1)
    expect(target.querySelector('input')).toBe(input)
    expect(input.id).toBe('field::field::control')
    expect(input.getAttribute('aria-labelledby')).toBe('field::field::label')
    expect(input.disabled).toBe(true)
    expect(input.required).toBe(true)
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(target.querySelector('[data-scope="checkbox"][data-part="root"]')!.hasAttribute('data-readonly')).toBe(true)
    expect(Array.from(new FormData(target.querySelector('form')!).entries())).toEqual([])
    flushSync(() => app.update({ field: {}, group: { name: 'hydrated' } }))
    for (let turn = 0; turn < 4; turn++) {
      await tick()
      flushSync()
    }
    expect(target.querySelector('input')).toBe(input)
    expect(input.disabled).toBe(false)
    expect(input.required).toBe(false)
    expect(Array.from(new FormData(target.querySelector('form')!).entries())).toEqual([['hydrated', 'alpha']])
    expect(errors).not.toHaveBeenCalled()
    expect(warnings).not.toHaveBeenCalled()
  }
  finally {
    await unmount(app)
    target.remove()
    errors.mockRestore()
    warnings.mockRestore()
  }
})
