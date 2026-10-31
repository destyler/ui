import type { Root } from 'react-dom/client'
import { act, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { Basic } from '../examples/Basic'

const starts = vi.hoisted(() => ({ count: 0, blocked: 0 }))
vi.mock('../hooks/use-tour', async (importOriginal) => {
  const original = await importOriginal<typeof import('../hooks/use-tour')>()
  return {
    ...original,
    useTour: (...args: Parameters<typeof original.useTour>) => {
      const api = original.useTour(...args)
      return {
        ...api,
        start: (...startArgs: Parameters<typeof api.start>) => {
          starts.count++
          // Bound the old whole-api effect's feedback loop without changing
          // machine subscriptions or hiding an unexpected restart.
          if (starts.count > 16) {
            starts.blocked++
            return
          }
          api.start(...startArgs)
        },
      }
    },
  }
})

const roots: Root[] = []
beforeEach(() => {
  starts.count = 0
  starts.blocked = 0
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
})
afterEach(async () => {
  for (const root of roots.splice(0))
    await act(async () => root.unmount())
  document.body.replaceChildren()
  vi.unstubAllGlobals()
})

it.each([false, true])('starts once per mount effect and stays closed after dismissal (StrictMode=%s)', async (strict) => {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  roots.push(root)
  const view = () => strict ? <StrictMode><Basic /></StrictMode> : <Basic />

  await act(async () => root.render(view()))
  expect(starts.blocked).toBe(0)
  expect(starts.count).toBe(strict ? 2 : 1)
  const content = container.querySelector<HTMLElement>('[data-scope="tour"][data-part="content"]')!
  expect(content.dataset.state).toBe('open')
  await act(async () => container.querySelector<HTMLButtonElement>('[data-scope="tour"][data-part="close-trigger"]')!.click())
  expect(content.dataset.state).toBe('closed')
  const afterClose = starts.count
  await act(async () => root.render(view()))
  expect(content.dataset.state).toBe('closed')
  expect(starts.count).toBe(afterClose)
})
