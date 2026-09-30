import { renderToString } from 'solid-js/web'
import { describe, expect, it, vi } from 'vitest'
import { Frame } from '../src/providers/frame'
import { FrameFixture } from './fixtures/frame'

const customSrcDoc = '<html><head></head><body><main class="frame-root"></main></body></html>'

describe('frame SSR', () => {
  it.each([undefined, customSrcDoc])('keeps hydration markers out of iframe fallback content for srcdoc %s', (srcdoc) => {
    expect(typeof window).toBe('undefined')
    expect(typeof document).toBe('undefined')
    const onMount = vi.fn()
    const html = renderToString(() => (
      <Frame
        title="Account preview"
        srcdoc={srcdoc}
        head={<style id="frame-head-style">{'body { color: black; }'}</style>}
        onMount={onMount}
      >
        <div>Framed content</div>
      </Frame>
    ))

    expect(html).toContain('title="Account preview"')
    const fallback = html.match(/<iframe\b[^>]*>([\s\S]*?)<\/iframe>/)?.[1]
    expect(fallback).toBe('')
    expect(html).not.toContain('Framed content')
    expect(html).not.toContain('frame-head-style')
    expect(onMount).not.toHaveBeenCalled()
  })
})

it('keeps the independently rendered interactive hydration fixture in sync', async () => {
  expect(typeof document).toBe('undefined')
  const html = renderToString(() => <FrameFixture />)
  expect(html).toMatch(/<iframe\b[^>]*><\/iframe>/)
  expect(html).not.toContain('Count:')
  await expect(html).toMatchFileSnapshot('./frame.ssr.html')
})
