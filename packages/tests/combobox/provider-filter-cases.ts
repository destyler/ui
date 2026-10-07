import { describe, expect, it, vi } from 'vitest'

export function providerFilterCases(mount: (container: HTMLElement) => (() => void) | Promise<() => void>) {
  async function setup() {
    const container = document.createElement('div')
    document.body.append(container)
    const unmount = await mount(container)
    const input = container.querySelector<HTMLInputElement>('input')!
    expect(input).not.toBeNull()
    input.focus()
    return {
      container,
      input,
      options: () => Array.from(document.querySelectorAll<HTMLElement>('[data-scope=combobox][data-part=item]')),
      dispose() {
        unmount()
        container.remove()
      },
      type(value: string) {
        input.value = value
        input.dispatchEvent(new Event('input', { bubbles: true }))
      },
      key(key: string) {
        input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
      },
    }
  }

  describe('RootProvider example collection reactivity', () => {
    it.each(['', 'Vue', 'Solid'])('keyboard selection matches rendered results for %j', async (query) => {
      const f = await setup()
      try {
        if (query)
          f.type(query)
        else
          f.container.querySelector<HTMLButtonElement>('[data-part=trigger]')!.click()
        await vi.waitFor(() => expect(f.options()).toHaveLength(query ? 1 : 3))
        f.key('ArrowDown')
        await vi.waitFor(() => expect(f.input.getAttribute('aria-activedescendant')).toBe(f.options()[0].id))
        f.key('Enter')
        await vi.waitFor(() => expect(f.input.value).toBe(query || 'React'))
      }
      finally { f.dispose() }
    })

    it('does not highlight missing results and preserves existing Enter reversion', async () => {
      const f = await setup()
      try {
        f.type('missing')
        await vi.waitFor(() => expect(f.options()).toHaveLength(0))
        f.key('ArrowDown')
        expect(f.input.getAttribute('aria-activedescendant')).toBeNull()
        f.key('Enter')
        // Existing core contract: allowCustomValue=false reverts an unmatched query.
        await vi.waitFor(() => expect(f.input.value).toBe(''))
        f.type('Vue')
        await vi.waitFor(() => expect(f.options()).toHaveLength(1))
        f.key('ArrowDown')
        await vi.waitFor(() => expect(f.input.getAttribute('aria-activedescendant')).toBe(f.options()[0].id))
        f.key('Enter')
        await vi.waitFor(() => expect(f.input.value).toBe('Vue'))
      }
      finally { f.dispose() }
    })

    it('tracks repeated collection replacement in one mounted example', async () => {
      const f = await setup()
      try {
        for (const query of ['Vue', 'Solid', 'React', 'Vue']) {
          f.type(query)
          await vi.waitFor(() => {
            expect(f.options()).toHaveLength(1)
            expect(f.options()[0].textContent).toContain(query)
          })
          f.key('ArrowDown')
          await vi.waitFor(() => expect(f.input.getAttribute('aria-activedescendant')).toBe(f.options()[0].id))
          f.key('Enter')
          await vi.waitFor(() => expect(f.input.value).toBe(query))
        }
      }
      finally { f.dispose() }
    })
  })
}
