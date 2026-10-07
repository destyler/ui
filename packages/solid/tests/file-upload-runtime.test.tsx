import type { UseFileUploadProps, UseFileUploadReturn } from '../src/components/file-upload/hooks/use-file-upload'
import { createSignal, Index } from 'solid-js'
import { render } from 'solid-js/web'
import { afterEach, expect, it, vi } from 'vitest'
import { FileUpload, useFileUpload } from '../src/components/file-upload'

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
    const url = `blob:solid-file-${nextUrl++}`
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
  const [props, setProps] = createSignal<UseFileUploadProps>({ id: 'files', ids: { hiddenInput: 'attachments-input', label: 'attachments-label' }, name: 'attachments', preventDocumentDrop: false, onFileChange: first })
  function Fixture(props: UseFileUploadProps) {
    api = useFileUpload(props)
    return (
      <FileUpload.RootProvider value={api}>
        <FileUpload.Label>Attachments</FileUpload.Label>
        <FileUpload.HiddenInput />
        <Index each={api().acceptedFiles}>
          {file => <FileUpload.Item file={file()}><FileUpload.ItemPreviewImage /><FileUpload.ItemName /></FileUpload.Item>}
        </Index>
      </FileUpload.RootProvider>
    )
  }
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
  const dispose = render(() => <Fixture {...props()} />, container)
  cleanups.push(() => {
    dispose()
    expect(active.size).toBe(0)
    expect(revoke.mock.calls.map(([url]) => url).sort()).toEqual([...created.keys()].sort())
    container.remove()
  })
  const input = container.querySelector('input')!
  expect(input.id).toBe('attachments-input')
  expect(container.querySelector('label')?.htmlFor).toBe(input.id)
  const a = new File(['a'], 'a.png', { type: 'image/png' })
  const b = new File(['b'], 'b.png', { type: 'image/png' })
  api!().setFiles([a])
  await vi.waitFor(() => expect(active.size).toBe(1))
  expect(create).toHaveBeenLastCalledWith(a)
  expectOwnedPreview(a)
  setProps({ ...props(), onFileChange: latest, disabled: true, required: true, accept: 'image/*' })
  await vi.waitFor(() => expect(input.disabled).toBe(true))
  expect(input.required).toBe(true)
  expect(input.accept).toBe('image/*')
  expect(container.querySelector('input')).toBe(input)
  api!().setFiles([b])
  await vi.waitFor(() => expect(container.querySelector('[data-part=item-name]')?.textContent).toBe('b.png'))
  expect(create).toHaveBeenLastCalledWith(b)
  expectOwnedPreview(b)
  expect(active.size).toBe(1)
  expect(first).toHaveBeenCalledTimes(1)
  expect(latest).toHaveBeenCalledTimes(1)
  api!().clearFiles()
  await vi.waitFor(() => expect(active.size).toBe(0))
  expect(container.querySelector('img')).toBeNull()
  expect(revoke.mock.calls.map(([url]) => url).sort()).toEqual([...created.keys()].sort())
  api!().setFiles([a])
  await vi.waitFor(() => expect(active.size).toBe(1))
  expectOwnedPreview(a)
})
