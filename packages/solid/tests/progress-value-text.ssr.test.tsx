import { renderToString } from 'solid-js/web'
import { describe, expect, it } from 'vitest'
import { Progress } from '../src/components/progress/index'

describe('progress value-text counterpart contracts', () => {
  it('renders numeric zero children instead of its percentage fallback', () => {
    const html = renderToString(() => <Progress.Root value={42}><Progress.ValueText>{0}</Progress.ValueText></Progress.Root>)
    expect(html.match(/<span\b[^>]*>(.*?)<\/span>/)?.[1]).toBe('0')
  })

  it('uses the percentage fallback when children are omitted', () => {
    const html = renderToString(() => <Progress.Root value={42}><Progress.ValueText /></Progress.Root>)
    expect(html.match(/<span\b[^>]*>(.*?)<\/span>/)?.[1]).toBe('42%')
  })
})
