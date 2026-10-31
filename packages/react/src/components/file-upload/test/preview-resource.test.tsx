import type { UseFileUploadReturn } from '../hooks/use-file-upload'
import { act, startTransition, StrictMode, Suspense, useLayoutEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { EnvironmentProvider } from '~/providers/environment/EnvironmentProvider'
import { useFileUpload } from '../hooks/use-file-upload'
import * as FileUpload from '../namespace'

beforeAll(() => vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true))
const disposers: (() => void)[] = []
afterEach(async () => {
  await act(async () => disposers.splice(0).reverse().forEach(dispose => dispose()))
  vi.restoreAllMocks()
})
afterAll(() => vi.unstubAllGlobals())
function mount() {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  disposers.push(() => {
    root.unmount()
    container.remove()
  })
  return { root, container }
}
function trackUrls(urlApi: typeof URL, prefix = 'preview') {
  let next = 0
  const live = new Set<string>()
  const create = vi.spyOn(urlApi, 'createObjectURL').mockImplementation(() => {
    const url = `blob:${prefix}-${++next}`
    live.add(url)
    return url
  })
  const revoke = vi.spyOn(urlApi, 'revokeObjectURL').mockImplementation((url) => {
    expect(live.delete(url)).toBe(true)
  })
  return { create, revoke, live }
}
function Preview({ api, file }: { api: UseFileUploadReturn, file: File }) {
  return <FileUpload.RootProvider value={api}><FileUpload.Item file={file}><FileUpload.ItemPreviewImage /></FileUpload.Item></FileUpload.RootProvider>
}

describe('file-upload preview resource lifetime', () => {
  it.each([false, true])('keeps the same file URL across metadata updates and balances cleanup (StrictMode=%s)', async (strict) => {
    const urls = trackUrls(URL)
    const first = new File(['first'], 'first.png', { type: 'image/png' })
    const second = new File(['second'], 'second.png', { type: 'image/png' })
    const { root, container } = mount()
    let api!: UseFileUploadReturn
    function Probe({ file }: { file: File }) {
      'use no memo'
      api = useFileUpload()
      return <Preview api={api} file={file} />
    }
    const render = (file: File) => act(async () => root.render(strict ? <StrictMode><Probe file={file} /></StrictMode> : <Probe file={file} />))
    await render(first)
    const initialCreates = urls.create.mock.calls.length
    const initialSrc = container.querySelector('img')?.getAttribute('src')
    for (let i = 0; i < 3; i++)
      await act(async () => api.openFilePicker())
    expect(urls.create).toHaveBeenCalledTimes(initialCreates)
    expect(container.querySelector('img')?.getAttribute('src')).toBe(initialSrc)
    await render(second)
    expect(urls.create).toHaveBeenCalledTimes(initialCreates + 1)
    expect(urls.revoke).toHaveBeenCalledWith(initialSrc)
    expect(urls.live.size).toBe(1)
    await act(async () => root.render(null))
    expect(urls.live.size).toBe(0)
    expect(urls.revoke.mock.calls.length).toBe(urls.create.mock.calls.length)
  })
  it('releases the old helper resource when RootProvider receives a replacement helper', async () => {
    const file = new File(['image'], 'image.png', { type: 'image/png' })
    const { root, container } = mount()
    const releaseFirst = vi.fn()
    const releaseSecond = vi.fn()
    const first = vi.fn<UseFileUploadReturn['createFileUrl']>((_file, cb) => {
      cb('blob:first')
      return releaseFirst
    })
    const second = vi.fn<UseFileUploadReturn['createFileUrl']>((_file, cb) => {
      cb('blob:second')
      return releaseSecond
    })
    function Probe({ helper }: { helper: UseFileUploadReturn['createFileUrl'] }) {
      const api = useFileUpload()
      return <Preview api={{ ...api, createFileUrl: helper }} file={file} />
    }
    await act(async () => root.render(<Probe helper={first} />))
    await act(async () => root.render(<Probe helper={first} />))
    expect(first).toHaveBeenCalledTimes(1)
    expect(releaseFirst).not.toHaveBeenCalled()
    await act(async () => root.render(<Probe helper={second} />))
    expect(releaseFirst).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenCalledTimes(1)
    expect(container.querySelector('img')?.getAttribute('src')).toBe('blob:second')
    await act(async () => root.render(null))
    expect(releaseSecond).toHaveBeenCalledTimes(1)
  })
  it('resolves a live root getter when an existing API is called without a rerender', async () => {
    const iframe = document.createElement('iframe')
    document.body.append(iframe)
    disposers.push(() => iframe.remove())
    const frameWindow = iframe.contentWindow!
    const outer = trackUrls(URL, 'outer')
    const inner = trackUrls((frameWindow as Window & typeof globalThis).URL, 'inner')
    let currentRoot: Document | Node = document
    const file = new File(['image'], 'image.png', { type: 'image/png' })
    const { root } = mount()
    let api!: UseFileUploadReturn
    function Probe() {
      api = useFileUpload()
      return null
    }
    await act(async () => root.render(<EnvironmentProvider value={() => currentRoot}><Probe /></EnvironmentProvider>))
    const savedApi = api
    const firstCleanup = savedApi.createFileUrl(file, vi.fn())
    expect(outer.live.size).toBe(1)
    currentRoot = frameWindow.document.body
    const secondCleanup = savedApi.createFileUrl(file, vi.fn())
    expect(inner.live.size).toBe(1)
    firstCleanup()
    secondCleanup()
    expect(outer.live.size).toBe(0)
    expect(inner.live.size).toBe(0)

    // A new getter with the same current window must not leave the stable helper
    // reading the old getter on later public API calls.
    currentRoot = document
    let replacementRoot: Document | Node = document
    await act(async () => root.render(<EnvironmentProvider value={() => replacementRoot}><Probe /></EnvironmentProvider>))
    expect(api.createFileUrl).toBe(savedApi.createFileUrl)
    replacementRoot = frameWindow.document
    const replacementCleanup = savedApi.createFileUrl(file, vi.fn())
    expect(inner.live.size).toBe(1)
    expect(outer.live.size).toBe(0)
    replacementCleanup()
    expect(inner.live.size).toBe(0)
  })

  it.each(['abort', 'commit'] as const)('does not publish a suspended environment before %s', async (outcome) => {
    const iframe = document.createElement('iframe')
    document.body.append(iframe)
    disposers.push(() => iframe.remove())
    const frameWindow = iframe.contentWindow!
    const outer = trackUrls(URL, 'outer')
    const inner = trackUrls((frameWindow as Window & typeof globalThis).URL, 'inner')
    const file = new File(['image'], 'image.png', { type: 'image/png' })
    const { root, container } = mount()
    let committed!: UseFileUploadReturn
    let change!: (pending: boolean) => void
    let speculativeRenders = 0
    let ready = false
    let release!: () => void
    const suspended = new Promise<void>((resolve) => {
      release = resolve
    })
    let layoutUrl = ''
    function LayoutConsumer({ api }: { api: UseFileUploadReturn }) {
      useLayoutEffect(() => {
        const cleanup = api.createFileUrl(file, (url) => {
          layoutUrl = url
        })
        cleanup()
      }, [api])
      return null
    }
    function Probe({ pending }: { pending: boolean }) {
      const api = useFileUpload()
      useLayoutEffect(() => {
        committed = api
      })
      if (pending && !ready) {
        speculativeRenders++
        throw suspended
      }
      return <><span>{pending ? 'inner' : 'outer'}</span><LayoutConsumer api={api} /></>
    }
    function App() {
      const [pending, setPending] = useState(false)
      change = setPending
      return (
        <Suspense fallback={<span>loading</span>}>
          <EnvironmentProvider value={pending ? frameWindow.document : document}>
            <Probe pending={pending} />
          </EnvironmentProvider>
        </Suspense>
      )
    }
    await act(async () => root.render(<App />))
    const savedApi = committed
    await act(async () => startTransition(() => change(true)))
    expect(speculativeRenders).toBeGreaterThan(0)
    expect(container.textContent).toBe('outer')
    expect(committed).toBe(savedApi)
    const pendingCleanup = savedApi.createFileUrl(file, vi.fn())
    expect(outer.live.size).toBe(1)
    expect(inner.create).not.toHaveBeenCalled()
    pendingCleanup()

    if (outcome === 'abort') {
      await act(async () => change(false))
    }
    else {
      await act(async () => {
        ready = true
        release()
        await suspended
      })
    }
    expect(container.textContent).toBe(outcome === 'abort' ? 'outer' : 'inner')
    expect(layoutUrl).toMatch(outcome === 'abort' ? /^blob:outer-/ : /^blob:inner-/)
    const finalCleanup = savedApi.createFileUrl(file, vi.fn())
    expect(outer.live.size).toBe(outcome === 'abort' ? 1 : 0)
    expect(inner.live.size).toBe(outcome === 'commit' ? 1 : 0)
    finalCleanup()
    expect(outer.live.size).toBe(0)
    expect(inner.live.size).toBe(0)
  })

  it('moves the URL resource to the new ownerWindow when the environment changes', async () => {
    const iframe = document.createElement('iframe')
    document.body.append(iframe)
    disposers.push(() => iframe.remove())
    const frameWindow = iframe.contentWindow!
    const outer = trackUrls(URL, 'outer')
    const inner = trackUrls((frameWindow as Window & typeof globalThis).URL, 'inner')
    const file = new File(['image'], 'image.png', { type: 'image/png' })
    const { root, container } = mount()
    function Probe() {
      const api = useFileUpload()
      return <Preview api={api} file={file} />
    }
    await act(async () => root.render(<EnvironmentProvider value={document}><Probe /></EnvironmentProvider>))
    expect(outer.live.size).toBe(1)
    await act(async () => root.render(<EnvironmentProvider value={frameWindow.document}><Probe /></EnvironmentProvider>))
    expect(outer.live.size).toBe(0)
    expect(inner.live.size).toBe(1)
    expect(container.querySelector('img')?.getAttribute('src')).toMatch(/^blob:inner-/)
    await act(async () => root.render(null))
    expect(inner.live.size).toBe(0)
  })
})
