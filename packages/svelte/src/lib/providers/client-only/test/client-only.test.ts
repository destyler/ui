import { hydrate, tick, unmount } from 'svelte'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import { clientOnlySsrMarkup } from './client-only-ssr-markup'
import Fixture from './ClientOnlyFixture.svelte'

describe('[client-only] provider', () => {
  it('shows client content after mounting and removes the fallback', async () => {
    const addedContent: string[] = []
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes)
          addedContent.push(node.textContent?.trim() ?? '')
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })

    try {
      await render(Fixture)
      await vi.waitFor(() => expect(addedContent).toContain('Fallback content'))
    }
    finally {
      observer.disconnect()
    }

    await expect.element(page.getByTestId('client-slot')).toBeVisible()
    await expect.element(page.getByTestId('fallback-slot')).not.toBeInTheDocument()
  })

  it('hydrates the server fallback without a mismatch', async () => {
    const target = document.createElement('div')
    target.innerHTML = clientOnlySsrMarkup
    document.body.append(target)
    expect(target.querySelector('[data-testid="fallback-slot"]')).not.toBeNull()

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    let instance: ReturnType<typeof hydrate> | undefined

    try {
      instance = hydrate(Fixture, { target })
      await tick()
      await vi.waitFor(() => {
        expect(target.querySelector('[data-testid="client-slot"]')).not.toBeNull()
        expect(target.querySelector('[data-testid="fallback-slot"]')).toBeNull()
      })

      expect(warn).not.toHaveBeenCalled()
      expect(error).not.toHaveBeenCalled()
    }
    finally {
      if (instance)
        await unmount(instance)
      target.remove()
      warn.mockRestore()
      error.mockRestore()
    }
  })
})
