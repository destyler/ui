import type { ReactNode } from 'react'
import type { Root } from 'react-dom/client'
import { createRef } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'
import { Progress } from '../index'

let root: Root | undefined
let mountedHost: HTMLElement | undefined

function cleanup() {
  try {
    if (root)
      flushSync(() => root?.unmount())
  }
  finally {
    root = undefined
    mountedHost?.remove()
    mountedHost = undefined
  }
}

afterEach(cleanup)

function setup() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  mountedHost = host
  root = createRoot(host)
  const ref = createRef<HTMLSpanElement>()
  return {
    host,
    ref,
    render(children: ReactNode) {
      flushSync(() => root!.render(
        <Progress.Root value={42}>
          <Progress.ValueText ref={ref} className="custom-value" data-testid="value">{children}</Progress.ValueText>
        </Progress.Root>,
      ))
    },
  }
}

describe('progress numeric-zero children', () => {
  it('removes only its own host and clears its ref on disposal', () => {
    const sentinel = document.createElement('aside')
    sentinel.textContent = 'unrelated owner'
    document.body.appendChild(sentinel)
    try {
      const fixture = setup()
      fixture.render(0)
      cleanup()
      expect(fixture.host.isConnected).toBe(false)
      expect(fixture.ref.current).toBeNull()
      expect(sentinel.isConnected).toBe(true)
      expect(sentinel.textContent).toBe('unrelated owner')
    }
    finally {
      sentinel.remove()
    }
  })

  it('preserves zero during repeated updates and forwards the host ref and props', () => {
    const fixture = setup()
    for (const [child, text] of [[5, '5'], [0, '0'], [-0, '0'], ['0', '0'], [7, '7'], [0, '0']] as const) {
      fixture.render(child)
      expect(fixture.ref.current?.textContent).toBe(text)
      expect(fixture.ref.current).toBe(fixture.host.querySelector('[data-testid="value"]'))
      expect(fixture.ref.current?.className).toBe('custom-value')
      expect(fixture.ref.current?.getAttribute('aria-live')).toBe('polite')
    }
  })

  it.each([
    { child: undefined, expected: '42%' },
    { child: null, expected: '42%' },
    { child: false, expected: '42%' },
    { child: '', expected: '42%' },
    { child: true, expected: '' },
  ])('preserves existing fallback behavior for $child', ({ child, expected }) => {
    const fixture = setup()
    fixture.render(child)
    expect(fixture.ref.current?.textContent).toBe(expected)
    fixture.render(0)
    expect(fixture.ref.current?.textContent).toBe('0')
  })
})
