import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { Progress } from '../index'

describe('progress value-text counterpart contracts', () => {
  it('renders numeric zero slot content instead of its percentage fallback', async () => {
    const app = createSSRApp({ render: () => h(Progress.Root, { modelValue: 42 }, () => h(Progress.ValueText, {}, () => 0)) })
    const html = await renderToString(app)
    expect(html.match(/<span\b[^>]*>(.*?)<\/span>/)?.[1].replace(/<!--.*?-->/g, '')).toBe('0')
  })

  it('uses the percentage fallback when the slot is omitted', async () => {
    const app = createSSRApp({ render: () => h(Progress.Root, { modelValue: 42 }, () => h(Progress.ValueText)) })
    const html = await renderToString(app)
    expect(html.match(/<span\b[^>]*>(.*?)<\/span>/)?.[1].replace(/<!--.*?-->/g, '')).toBe('42%')
  })
})
