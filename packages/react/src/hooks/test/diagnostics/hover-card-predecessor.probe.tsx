import type { ReactNode } from 'react'
import type { Root } from 'react-dom/client'
import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { useFloatingPanel } from '~/components/floating-panel'
import { useHoverCard } from '~/components/hover-card'
import { createOpenStateTrace } from '../open-state-trace'
import { observeMachines, readObservedMachine } from './use-observed-machine'

const roots = new Set<Root>()
beforeEach(() => vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true))
afterEach(async () => {
  for (const root of roots)
    await act(async () => root.unmount())
  roots.clear()
  document.body.replaceChildren()
  vi.unstubAllGlobals()
})

// Keep the same DOM shape, act boundary, and zero-delay yield as the original
// controllable migration test. This file runs only through the opt-in config.
function parts(api: any): ReactNode {
  return (
    <div {...api.getRootProps?.()}>
      {api.getTriggerProps && <button {...api.getTriggerProps()}>Trigger</button>}
      {api.getInputProps && <input {...api.getInputProps()} />}
      {api.getPositionerProps
        ? <div {...api.getPositionerProps()}><div {...api.getContentProps?.()} /></div>
        : api.getContentProps && <div {...api.getContentProps()} />}
    </div>
  )
}

async function mountHook(hook: (props: any) => any, props: any, onRender: (api: any) => void) {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  roots.add(root)
  let api: any
  function Harness(props: any) {
    'use no memo'
    const result = hook(props)
    api = result.api ?? result
    onRender(api)
    return parts(api)
  }
  await act(async () => root.render(createElement(Harness, props)))
  return {
    container,
    get api() { return api },
    async change(action: (api: any) => void) {
      await act(async () => {
        action(api)
        await new Promise<void>(resolve => setTimeout(resolve, 0))
      })
    },
    async unmount() {
      await act(async () => root.unmount())
      roots.delete(root)
      container.remove()
    },
  }
}

function plainTrigger() {
  return { getTriggerProps: () => ({}) }
}

describe('bounded HoverCard predecessor observation', () => {
  for (const predecessor of ['plain', 'floating-panel'] as const) {
    for (const pointer of ['trigger', 'outside'] as const) {
      it(`${predecessor} predecessor with pointer over ${pointer}`, async () => {
        const trace = createOpenStateTrace()
        const stopObserving = observeMachines(trace.record)
        trace.record('condition', { predecessor, pointer, userAgent: navigator.userAgent })
        try {
          const onPreviousOpenChange = vi.fn(details => trace.record('predecessor onOpenChange', details))
          const previous = await mountHook(
            predecessor === 'plain' ? plainTrigger : useFloatingPanel,
            { open: undefined, defaultOpen: false, onOpenChange: onPreviousOpenChange },
            api => trace.record('predecessor render', { open: api.open }),
          )
          if (predecessor === 'floating-panel') {
            for (const open of [true, false, true, false]) {
              await previous.change(api => api.setOpen(open))
              await vi.waitFor(() => {
                expect(previous.api.open).toBe(open)
                expect(previous.container.querySelector('[data-state]')?.getAttribute('data-state')).toBe(open ? 'open' : 'closed')
              })
              await vi.waitFor(() => expect(onPreviousOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open })))
            }
          }

          const trigger = previous.container.querySelector('button')!
          const outside = document.createElement('button')
          outside.textContent = 'Outside diagnostic fixture'
          Object.assign(outside.style, { position: 'fixed', right: '0px', bottom: '0px' })
          document.body.append(outside)
          const target = pointer === 'trigger' ? trigger : outside
          const pointerRect = target.getBoundingClientRect()
          const pointerPoint = { x: pointerRect.x + pointerRect.width / 2, y: pointerRect.y + pointerRect.height / 2 }
          await userEvent.hover(target)
          trace.record('seeded pointer', { point: pointerPoint, triggerRect: trigger.getBoundingClientRect().toJSON() })
          await previous.unmount()
          document.body.replaceChildren()
          trace.record('predecessor removed', { activeElement: document.activeElement?.tagName })

          const onOpenChange = vi.fn(details => trace.record('onOpenChange', details))
          const harness = await mountHook(
            useHoverCard,
            { open: undefined, defaultOpen: false, openDelay: 0, closeDelay: 0, onOpenChange },
            api => trace.record('render', { open: api.open }),
          )
          trace.attach(harness.container, () => harness.api)
          expect(readObservedMachine('hover-card'), 'The diagnostic alias must expose the raw HoverCard machine').toMatchObject({ id: 'hover-card' })
          trace.record('replacement geometry', {
            triggerRect: harness.container.querySelector('button')!.getBoundingClientRect().toJSON(),
            pointTarget: document.elementFromPoint(pointerPoint.x, pointerPoint.y)?.outerHTML,
          })

          for (const [iteration, open] of [true, false, true, false].entries()) {
            trace.record('request', { iteration, open, apiOpen: harness.api.open, machine: readObservedMachine('hover-card') })
            await harness.change(api => api.setOpen(open))
            trace.record('after act', { iteration, open, apiOpen: harness.api.open, machine: readObservedMachine('hover-card') })
            await vi.waitFor(() => {
              if (harness.api.open !== open)
                trace.record('mismatch', { iteration, open, apiOpen: harness.api.open, machine: readObservedMachine('hover-card') })
              expect(harness.api.open).toBe(open)
              expect(harness.container.querySelector('[data-state]')?.getAttribute('data-state')).toBe(open ? 'open' : 'closed')
            })
            await vi.waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open })))
            trace.record('settled', { iteration, open })
          }
        }
        finally {
          // One report per condition, including successful negative observations.
          // eslint-disable-next-line no-console
          console.info(`[hover-card predecessor observation: ${predecessor}/${pointer}]`, trace.report())
          trace.dispose()
          stopObserving()
        }
      })
    }
  }
})
