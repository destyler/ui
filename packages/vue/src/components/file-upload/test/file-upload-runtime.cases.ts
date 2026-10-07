import type { UseFileUploadProps, UseFileUploadReturn } from '../composables/use-file-upload'
import { afterEach, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, reactive } from 'vue'
import { FileUpload, useFileUpload } from '../index'

const cleanups: Array<() => void> = []
afterEach(() => {
  cleanups.splice(0).forEach(cleanup => cleanup())
  vi.restoreAllMocks()
})
it('updates options and callback ownership while releasing every replaced preview URL', async () => {
  const active = new Set<string>()
  const created = new Map<string, Blob>()
  let nextUrl = 0
  const create = vi.spyOn(URL, 'createObjectURL').mockImplementation((file) => {
    const url = `blob:vue-file-${nextUrl++}`
    active.add(url)
    created.set(url, file as Blob)
    return url
  })
  const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation((url) => {
    active.delete(url)
  })
  const first = vi.fn()
  const latest = vi.fn()
  let api: UseFileUploadReturn
  const props = reactive<UseFileUploadProps>({ id: 'files', ids: { hiddenInput: 'attachments-input', label: 'attachments-label' }, name: 'attachments', preventDocumentDrop: false, onFileChange: first })
  const Fixture = defineComponent({ setup() {
    api = useFileUpload(props)
    return () => h(FileUpload.RootProvider, { value: api.value }, () => [
      h(FileUpload.Label, {}, () => 'Attachments'),
      h(FileUpload.HiddenInput),
      ...api.value.acceptedFiles.map((file, index) => h(FileUpload.Item, { key: index, file }, () => [h(FileUpload.ItemPreviewImage), h(FileUpload.ItemName)])),
    ])
  } })
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
  const app = createApp(Fixture)
  app.mount(container)
  cleanups.push(() => {
    app.unmount()
    expect(active.size).toBe(0)
    expect(revoke.mock.calls.map(([url]) => url).sort()).toEqual([...created.keys()].sort())
    container.remove()
  })
  const input = container.querySelector('input')!
  expect(input.id).toBe('attachments-input')
  expect(container.querySelector('label')?.htmlFor).toBe(input.id)
  const a = new File(['a'], 'a.png', { type: 'image/png' })
  const b = new File(['b'], 'b.png', { type: 'image/png' })
  api!.value.setFiles([a])
  await nextTick()
  await vi.waitFor(() => expect(active.size).toBe(1))
  expect(create).toHaveBeenLastCalledWith(a)
  expectOwnedPreview(a)
  Object.assign(props, { onFileChange: latest, disabled: true, required: true, accept: 'image/*' })
  await nextTick()
  await vi.waitFor(() => expect(input.disabled).toBe(true))
  expect(input.required).toBe(true)
  expect(input.accept).toBe('image/*')
  expect(container.querySelector('input')).toBe(input)
  api!.value.setFiles([b])
  await nextTick()
  await vi.waitFor(() => expect(container.querySelector('[data-part=item-name]')?.textContent).toBe('b.png'))
  expect(create).toHaveBeenLastCalledWith(b)
  expectOwnedPreview(b)
  expect(active.size).toBe(1)
  expect(first).toHaveBeenCalledTimes(1)
  expect(latest).toHaveBeenCalledTimes(1)
  api!.value.clearFiles()
  await nextTick()
  await vi.waitFor(() => expect(active.size).toBe(0))
  expect(container.querySelector('img')).toBeNull()
  expect(revoke.mock.calls.map(([url]) => url).sort()).toEqual([...created.keys()].sort())
  api!.value.setFiles([a])
  await nextTick()
  await vi.waitFor(() => expect(active.size).toBe(1))
  expectOwnedPreview(a)
})
