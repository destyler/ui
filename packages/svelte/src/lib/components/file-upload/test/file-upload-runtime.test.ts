import { flushSync, mount, tick, unmount } from 'svelte'
import { afterEach, expect, it, vi } from 'vitest'
import RuntimeContract from './RuntimeContract.svelte'

const cleanups: Array<() => Promise<void>> = []
afterEach(async () => {
  for (const cleanup of cleanups.splice(0)) await cleanup()
  vi.restoreAllMocks()
})
it('updates options and callback ownership while releasing every replaced preview URL', async () => {
  const active = new Set<string>()
  const created = new Map<string, Blob>()
  let nextUrl = 0
  const create = vi.spyOn(URL, 'createObjectURL').mockImplementation((file) => {
    const url = `blob:svelte-file-${nextUrl++}`
    active.add(url)
    created.set(url, file as Blob)
    return url
  })
  const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation((url) => {
    active.delete(url)
  })
  const first = vi.fn()
  const latest = vi.fn()
  const container = document.createElement('div')
  document.body.append(container)
  function expectOwnedPreview(file: File) {
    const images = container.querySelectorAll('img')
    expect(images).toHaveLength(1)
    const url = images[0].getAttribute('src')!
    expect(created.get(url)).toBe(file)
    expect(images[0].alt).toBe(`preview of ${file.name}`)
    expect(active).toEqual(new Set([url]))
    const retired = [...created.keys()].filter(value => value !== url).sort()
    expect(revoke.mock.calls.map(([value]) => value).sort()).toEqual(retired)
  }
  const instance = mount(RuntimeContract, { target: container, props: { initialProps: { ids: { hiddenInput: 'attachments-input', label: 'attachments-label' }, name: 'attachments', onFileChange: first } } })
  flushSync()
  await tick()
  cleanups.push(async () => {
    await unmount(instance)
    expect(active.size).toBe(0)
    expect(revoke.mock.calls.map(([url]) => url).sort()).toEqual([...created.keys()].sort())
    container.remove()
  })
  const input = container.querySelector('input')!
  expect(input.id).toBe('attachments-input')
  expect(container.querySelector('label')?.htmlFor).toBe(input.id)
  const a = new File(['a'], 'a.png', { type: 'image/png' })
  const b = new File(['b'], 'b.png', { type: 'image/png' })
  flushSync(() => instance.getApi().setFiles([a]))
  await tick()
  expect(active.size).toBe(1)
  expect(create).toHaveBeenLastCalledWith(a)
  expectOwnedPreview(a)
  flushSync(() => instance.update({ onFileChange: latest, disabled: true, required: true, accept: 'image/*' }))
  await tick()
  expect(input.disabled).toBe(true)
  expect(input.required).toBe(true)
  expect(input.accept).toBe('image/*')
  expect(container.querySelector('input')).toBe(input)
  flushSync(() => instance.getApi().setFiles([b]))
  await tick()
  expect(container.querySelector('[data-part=item-name]')?.textContent).toBe('b.png')
  expect(create).toHaveBeenLastCalledWith(b)
  expectOwnedPreview(b)
  expect(active.size).toBe(1)
  expect(first).toHaveBeenCalledTimes(1)
  expect(latest).toHaveBeenCalledTimes(1)
  flushSync(() => instance.getApi().clearFiles())
  await tick()
  expect(container.querySelector('img')).toBeNull()
  expect(revoke.mock.calls.map(([url]) => url).sort()).toEqual([...created.keys()].sort())
  expect(active.size).toBe(0)
  flushSync(() => instance.getApi().setFiles([a]))
  await tick()
  expect(active.size).toBe(1)
  expectOwnedPreview(a)
})
