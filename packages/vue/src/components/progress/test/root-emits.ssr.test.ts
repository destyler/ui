import { describe, expect, it, vi } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { Progress, useProgress } from '../index'

for (const provider of [false, true]) {
  describe(`progress initial rendering (RootProvider=${provider})`, () => {
    it.each([
      { value: 0, expected: '0%', state: 'loading' },
      { value: null, expected: '', state: 'indeterminate' },
      { value: undefined, expected: '70%', state: 'loading' },
      { value: 100, expected: '100%', state: 'complete' },
    ])('does not emit while rendering $value', async ({ value, expected, state }) => {
      const onValueChange = vi.fn()
      const onModelValue = vi.fn()
      const children = () => [h(Progress.ValueText), h(Progress.Track)]
      const app = createSSRApp({
        setup() {
          if (!provider)
            return () => h(Progress.Root, { 'modelValue': value, 'defaultValue': 70, onValueChange, 'onUpdate:modelValue': onModelValue }, children)
          const api = useProgress({ modelValue: value, defaultValue: 70, onValueChange })
          return () => h(Progress.RootProvider, { value: api.value }, children)
        },
      })
      const html = await renderToString(app)
      expect(html.match(/<span\b[^>]*>(.*?)<\/span>/)?.[1].replace(/<!--.*?-->/g, '')).toBe(expected)
      expect(html).toContain(`data-state="${state}"`)
      expect(html.includes('aria-valuenow=')).toBe(value !== null)
      expect(onValueChange).not.toHaveBeenCalled()
      expect(onModelValue).not.toHaveBeenCalled()
    })
  })
}
