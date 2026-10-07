import { act, createRef } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AspectRatio } from '../components/aspect-ratio'
import { Breadcrumbs } from '../components/breadcrumbs'
import { Label } from '../components/label'
import { Separator } from '../components/separator'

vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)

const cleanups: (() => Promise<void>)[] = []
afterEach(async () => {
  for (const cleanup of cleanups.splice(0))
    await cleanup()
})

describe('structural rendered contracts', () => {
  it('updates ratio and orientation while retaining nodes, caller IDs and composed label refs', async () => {
    const host = document.createElement('main')
    document.body.append(host)
    const root = createRoot(host)
    cleanups.push(async () => {
      await act(async () => root.unmount())
      host.remove()
    })
    // eslint-disable-next-line react/no-create-ref -- This imperative test harness owns an object ref outside React render and verifies its public lifecycle.
    const parentRef = createRef<HTMLLabelElement>()
    // eslint-disable-next-line react/no-create-ref -- This imperative test harness owns an object ref outside React render and verifies its public lifecycle.
    const childRef = createRef<HTMLLabelElement>()
    const view = (ratio: number, vertical: boolean) => (
      <>
        <AspectRatio.Root id="frame" ratio={ratio}><AspectRatio.Content id="caller-content">Media</AspectRatio.Content></AspectRatio.Root>
        <Separator.Root orientation={vertical ? 'vertical' : 'horizontal'} />
        <Label.Root asChild htmlFor="field" ref={parentRef}><label ref={childRef} id="caller-label">Name</label></Label.Root>
        <input id="field" />
      </>
    )
    await act(async () => root.render(view(2, false)))
    const frame = host.querySelector<HTMLElement>('[data-scope="aspect-ratio"][data-part="root"]')!
    const separator = host.querySelector('[role="separator"]')!
    expect(frame.style.paddingBottom).toBe('50%')
    expect(parentRef.current).toBe(childRef.current)
    expect(parentRef.current).toBe(host.querySelector('label'))
    expect(parentRef.current?.htmlFor).toBe('field')
    expect(parentRef.current?.id).toBe('caller-label')
    await act(async () => root.render(view(0.5, true)))
    expect(host.querySelector('[data-scope="aspect-ratio"][data-part="root"]')).toBe(frame)
    expect(frame.style.paddingBottom).toBe('200%')
    expect(host.querySelector('#caller-content')?.parentElement).toBe(frame)
    expect(separator.getAttribute('aria-orientation')).toBe('vertical')
    expect(separator.getAttribute('data-orientation')).toBe('vertical')
    await act(async () => root.unmount())
    expect(parentRef.current).toBeNull()
    expect(childRef.current).toBeNull()
    cleanups.pop()
    host.remove()
  })

  it('preserves link semantics and reflects focus without moving focus away from the native link', async () => {
    const host = document.createElement('main')
    document.body.append(host)
    const root = createRoot(host)
    cleanups.push(async () => {
      await act(async () => root.unmount())
      host.remove()
    })
    const home = { id: 'home', label: 'Home', href: '/' }
    await act(async () => root.render(<Breadcrumbs.Root items={[home]}><Breadcrumbs.List><Breadcrumbs.Item item={home}><Breadcrumbs.Link item={home}>Home</Breadcrumbs.Link><Breadcrumbs.Separator>/</Breadcrumbs.Separator></Breadcrumbs.Item></Breadcrumbs.List></Breadcrumbs.Root>))
    const link = host.querySelector('a')!
    await act(async () => link.focus())
    expect(document.activeElement).toBe(link)
    expect(link.getAttribute('data-focus')).toBe('true')
    expect(link.getAttribute('href')).toBe('/')
    expect(host.querySelector('[data-part="separator"]')?.getAttribute('aria-hidden')).toBe('true')
    await act(async () => link.blur())
    expect(link.getAttribute('data-focus')).toBe('false')
  })
})
