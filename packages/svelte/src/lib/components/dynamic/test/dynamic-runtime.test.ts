import { flushSync, mount, tick, unmount } from 'svelte'
import { afterEach, expect, it, vi } from 'vitest'
import RuntimeContract from './RuntimeContract.svelte'

const cleanups: Array<() => Promise<void>> = []
afterEach(async () => {
  for (const cleanup of cleanups.splice(0))
    await cleanup()
})

it('keeps Dynamic mutable live state and latest callbacks on the same DOM nodes', async () => {
  const first = vi.fn()
  const latest = vi.fn()
  const inputChanged = vi.fn()
  const container = document.createElement('div')
  document.body.append(container)
  const instance = mount(RuntimeContract, { target: container })
  flushSync(() => instance.update({ value: ['Parent'], inputValue: 'Parent text', onValueChange: first, onInputValueChange: inputChanged }))
  await tick()
  cleanups.push(async () => {
    await unmount(instance)
    container.remove()
  })
  const input = container.querySelector<HTMLInputElement>('[data-part=input]')!
  const hidden = container.querySelector<HTMLInputElement>('[name=tags]')!
  expect(instance.getApi().value).toEqual(['Parent'])
  flushSync(() => {
    instance.getApi().setValue(['Internal', 'Second'])
    instance.getApi().setInputValue('Draft')
  })
  await tick()
  expect(instance.getApi().value).toEqual(['Internal', 'Second'])
  expect(instance.getApi().inputValue).toBe('Draft')
  expect(hidden.value).toBe('["Internal","Second"]')
  expect(input.value).toBe('Draft')
  expect(first.mock.calls).toEqual([[{ value: ['Internal', 'Second'] }]])
  expect(inputChanged.mock.calls).toEqual([[{ inputValue: 'Draft' }]])
  flushSync(() => instance.update({ value: ['Later'], inputValue: 'Later text', onValueChange: latest, onInputValueChange: inputChanged }))
  await tick()
  expect(instance.getApi().value).toEqual(['Later'])
  expect(instance.getApi().inputValue).toBe('Later text')
  expect(input.value).toBe('Later text')
  expect(container.querySelector('[data-part=input]')).toBe(input)
  expect(container.querySelector('[name=tags]')).toBe(hidden)
  flushSync(() => instance.getApi().setValue(['Latest callback']))
  await tick()
  expect(first).toHaveBeenCalledTimes(1)
  expect(latest.mock.calls).toEqual([[{ value: ['Latest callback'] }]])
  expect(inputChanged).toHaveBeenCalledTimes(1)
})
