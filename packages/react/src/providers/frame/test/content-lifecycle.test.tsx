import { act, createRef, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { afterAll, afterEach, beforeAll, expect, it, vi } from 'vitest'
import { FrameContent } from '../components/Content'
import { Frame } from '../components/Frame'

beforeAll(() => vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true))
const disposers: (() => void)[] = []
afterEach(async () => {
  await act(async () => disposers.splice(0).forEach(dispose => dispose()))
})
afterAll(() => vi.unstubAllGlobals())

it('pairs every StrictMode setup with cleanup while keeping the visible content active', async () => {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  disposers.push(() => {
    root.unmount()
    container.remove()
  })
  let active = 0
  const history: string[] = []
  const onMount = () => {
    active++
    history.push('mount')
  }
  const onUnmount = () => {
    active--
    history.push('unmount')
  }
  await act(async () => root.render(<StrictMode><FrameContent onMount={onMount} onUnmount={onUnmount}><button>Frame child</button></FrameContent></StrictMode>))
  expect(container.querySelector('button')?.textContent).toBe('Frame child')
  expect(active).toBe(1)
  expect(history).toEqual(['mount', 'unmount', 'mount'])
  await act(async () => root.render(null))
  expect(active).toBe(0)
  expect(history).toEqual(['mount', 'unmount', 'mount', 'unmount'])
})

it('releases resources registered by the public Frame callbacks after StrictMode teardown', async () => {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  disposers.push(() => {
    root.unmount()
    container.remove()
  })
  // eslint-disable-next-line react/no-create-ref -- This imperative test harness owns an object ref outside React render and verifies its public lifecycle.
  const frame = createRef<HTMLIFrameElement>()
  const received = vi.fn()
  let remove: (() => void) | undefined
  const onMount = () => {
    const doc = frame.current!.contentDocument!
    doc.addEventListener('frame-audit-event', received)
    remove = () => doc.removeEventListener('frame-audit-event', received)
  }
  const onUnmount = () => remove?.()
  await act(async () => root.render(
    <StrictMode>
      <Frame ref={frame} title="Lifecycle frame" onMount={onMount} onUnmount={onUnmount}>
        <button>Portalled child</button>
      </Frame>
    </StrictMode>,
  ))
  const doc = frame.current!.contentDocument!
  expect(doc.querySelector('button')?.textContent).toBe('Portalled child')
  doc.dispatchEvent(new Event('frame-audit-event'))
  expect(received).toHaveBeenCalledTimes(1)
  await act(async () => root.render(null))
  doc.dispatchEvent(new Event('frame-audit-event'))
  expect(received).toHaveBeenCalledTimes(1)
})

it('keeps one lifecycle on ordinary rerenders even when callback identities change', async () => {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  disposers.push(() => {
    root.unmount()
    container.remove()
  })
  const mounted = vi.fn()
  const unmounted = vi.fn()
  const laterMount = vi.fn()
  const laterUnmount = vi.fn()
  await act(async () => root.render(<FrameContent onMount={mounted} onUnmount={unmounted}>First</FrameContent>))
  expect(mounted).toHaveBeenCalledTimes(1)
  expect(unmounted).not.toHaveBeenCalled()
  await act(async () => root.render(<FrameContent onMount={laterMount} onUnmount={laterUnmount}>Second</FrameContent>))
  expect(container.textContent).toBe('Second')
  expect(mounted).toHaveBeenCalledTimes(1)
  expect(unmounted).not.toHaveBeenCalled()
  expect(laterMount).not.toHaveBeenCalled()
  expect(laterUnmount).not.toHaveBeenCalled()
  await act(async () => root.render(null))
  expect(unmounted).toHaveBeenCalledTimes(1)
  expect(laterUnmount).not.toHaveBeenCalled()
})
