import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { Highlight } from '../index'

describe('vue Highlight attribute SSR', () => {
  it('renders escaped mark attributes for each match in a real Node environment', async () => {
    expect(typeof window).toBe('undefined')
    expect(typeof document).toBe('undefined')
    const html = await renderToString(createSSRApp({ render: () => h(Highlight, { 'text': '<b>one</b> & one', 'query': 'one', 'matchAll': true, 'class': 'match', 'title': 'a"<&', 'data-result': 'yes' }) }))
    expect(html.match(/<mark\b/g)).toHaveLength(2)
    expect(html.match(/class="match"/g)).toHaveLength(2)
    expect(html.match(/title="a&quot;&lt;&amp;"/g)).toHaveLength(2)
    expect(html.match(/data-result="yes"/g)).toHaveLength(2)
    expect(html).toContain('&lt;b&gt;')
    expect(html).toContain('&lt;/b&gt; &amp; ')
    expect(html).not.toContain('<b>')
  })

  it('keeps the no-match server output text-only', async () => {
    expect(typeof window).toBe('undefined')
    expect(typeof document).toBe('undefined')
    const html = await renderToString(createSSRApp({ render: () => h(Highlight, { text: '<b>plain</b>', query: 'absent', class: 'unused' }) }))
    expect(html.replace(/<!--[\s\S]*?-->/g, '')).toBe('&lt;b&gt;plain&lt;/b&gt;')
    expect(html).not.toContain('<mark')
    expect(html).not.toContain('unused')
  })
})
