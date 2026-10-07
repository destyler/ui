import type { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { Progress, useProgress } from '../index'

function ProviderFixture({ children }: { children?: ReactNode }) {
  const api = useProgress({ value: 42 })
  return <Progress.RootProvider value={api}><Progress.ValueText>{children}</Progress.ValueText></Progress.RootProvider>
}

const cases: Array<{ label: string, children: ReactNode, expected: string }> = [
  { label: 'zero', children: 0, expected: '0' },
  { label: 'negative zero', children: -0, expected: '0' },
  { label: 'nonzero number', children: 5, expected: '5' },
  { label: 'text', children: 'Loaded', expected: 'Loaded' },
  { label: 'string zero', children: '0', expected: '0' },
  { label: 'undefined fallback', children: undefined, expected: '42%' },
  { label: 'null fallback', children: null, expected: '42%' },
  { label: 'false fallback', children: false, expected: '42%' },
  { label: 'empty string fallback', children: '', expected: '42%' },
  { label: 'true stays empty', children: true, expected: '' },
  { label: 'empty array stays empty', children: [], expected: '' },
]

for (const provider of [false, true]) {
  describe(`progress value text (RootProvider=${provider})`, () => {
    it.each(cases)('renders $label', ({ children, expected }) => {
      const html = renderToStaticMarkup(provider
        ? <ProviderFixture>{children}</ProviderFixture>
        : <Progress.Root value={42}><Progress.ValueText>{children}</Progress.ValueText></Progress.Root>)
      expect(html.match(/<span\b[^>]*>(.*?)<\/span>/)?.[1]).toBe(expected)
    })
  })
}
