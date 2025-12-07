import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import ClientOnlyBasic from './fixtures/ClientOnlyBasic.vue'

describe('[client-only] provider', () => {
  it('shows client content after hydration and hides the fallback slot', async () => {
    render(ClientOnlyBasic)

    const client = page.getByTestId('client-slot')
    const fallback = page.getByTestId('fallback-slot')

    await expect.element(client).toBeVisible()
    await expect.element(fallback).not.toBeInTheDocument()
  })
})
