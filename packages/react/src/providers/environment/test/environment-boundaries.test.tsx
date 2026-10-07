import type { ReactNode } from 'react'
import type { RootNode, UseEnvironmentContext } from '../index'
import { act, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { EnvironmentProvider, useEnvironmentContext } from '../index'

beforeAll(() => vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true))
const disposers: (() => void)[] = []
afterEach(async () => {
  await act(async () => disposers.splice(0).reverse().forEach(dispose => dispose()))
})
afterAll(() => vi.unstubAllGlobals())

function frameDocument() {
  const frame = document.createElement('iframe')
  frame.title = 'Environment boundary'
  document.body.append(frame)
  disposers.push(() => frame.remove())
  return frame.contentDocument!
}

function mount() {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  disposers.push(() => {
    root.unmount()
    container.remove()
  })
  return root
}

function Capture({ name, contexts }: { name: string, contexts: Map<string, UseEnvironmentContext> }) {
  const context = useEnvironmentContext()
  useLayoutEffect(() => {
    contexts.set(name, context)
  }, [name, context, contexts])
  return <button type="button">{name}</button>
}

function expectEnvironment(context: UseEnvironmentContext, root: RootNode, doc: Document) {
  expect(context.getRootNode()).toBe(root)
  expect(context.getDocument()).toBe(doc)
  expect(context.getWindow()).toBe(doc.defaultView)
}

describe('environment document boundaries', () => {
  it('resolves explicit Document, Element and ShadowRoot values and replacement documents', async () => {
    const first = frameDocument()
    const second = frameDocument()
    const element = first.createElement('section')
    first.body.append(element)
    const shadow = element.attachShadow({ mode: 'open' })
    const root = mount()
    const contexts = new Map<string, UseEnvironmentContext>()
    for (const [value, doc] of [[first, first], [element, first], [shadow, first], [second, second]] as const) {
      await act(async () => root.render(<EnvironmentProvider value={value}><Capture name="target" contexts={contexts} /></EnvironmentProvider>))
      expectEnvironment(contexts.get('target')!, value, doc)
    }
  })

  it('evaluates the provided root getter at call time without requiring a rerender', async () => {
    const first = frameDocument()
    const second = frameDocument()
    let current: RootNode = first
    const root = mount()
    const contexts = new Map<string, UseEnvironmentContext>()
    await act(async () => root.render(<EnvironmentProvider value={() => current}><Capture name="target" contexts={contexts} /></EnvironmentProvider>))
    const context = contexts.get('target')!
    expectEnvironment(context, first, first)
    current = second.body
    expectEnvironment(context, second.body, second)
  })

  it('uses the portal document when no explicit root is supplied', async () => {
    const foreign = frameDocument()
    const root = mount()
    const contexts = new Map<string, UseEnvironmentContext>()
    const children: ReactNode = <EnvironmentProvider><Capture name="portal" contexts={contexts} /></EnvironmentProvider>
    await act(async () => root.render(createPortal(children, foreign.body)))
    expect(foreign.querySelector('button')?.textContent).toBe('portal')
    expectEnvironment(contexts.get('portal')!, foreign, foreign)
  })

  it('keeps nested and sibling providers isolated while the nearest root changes', async () => {
    const outer = frameDocument()
    const inner = frameDocument()
    const root = mount()
    const contexts = new Map<string, UseEnvironmentContext>()
    const render = (value: RootNode) => (
      <>
        <Capture name="default" contexts={contexts} />
        <EnvironmentProvider value={outer}>
          <Capture name="outer" contexts={contexts} />
          <EnvironmentProvider value={value}><Capture name="inner" contexts={contexts} /></EnvironmentProvider>
          <Capture name="sibling" contexts={contexts} />
        </EnvironmentProvider>
      </>
    )
    for (const [value, doc] of [[inner, inner], [document.body, document]] as const) {
      await act(async () => root.render(render(value)))
      expectEnvironment(contexts.get('default')!, document, document)
      expectEnvironment(contexts.get('outer')!, outer, outer)
      expectEnvironment(contexts.get('sibling')!, outer, outer)
      expectEnvironment(contexts.get('inner')!, value, doc)
    }
  })
})
