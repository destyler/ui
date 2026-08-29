import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import Basic from '../examples/Basic.svelte'
import LocaleValue from '../examples/LocaleValue.svelte'
import FilterFixture from './FilterFixture.svelte'
import LocaleProviderFixture from './LocaleProviderFixture.svelte'

describe('[locale] provider', () => {
  it('provides the locale and text direction to descendants', async () => {
    await render(Basic)

    const value = page.getByText('Locale: ar-SA; direction: rtl')
    await expect.element(value).toBeVisible()
    await expect.element(value).toHaveAttribute('dir', 'rtl')
  })

  it('uses en-US and left-to-right direction without a provider', async () => {
    await render(LocaleValue)

    const value = page.getByText('Locale: en-US; direction: ltr')
    await expect.element(value).toBeVisible()
    await expect.element(value).toHaveAttribute('dir', 'ltr')
  })

  it('updates descendants when the locale changes', async () => {
    await render(LocaleProviderFixture)

    const initialValue = page.getByText('Locale: en-US; direction: ltr')
    await expect.element(initialValue).toHaveAttribute('dir', 'ltr')

    await userEvent.click(page.getByRole('button', { name: 'Change locale' }))

    const updatedValue = page.getByText('Locale: ar-SA; direction: rtl')
    await expect.element(updatedValue).toBeVisible()
    await expect.element(updatedValue).toHaveAttribute('dir', 'rtl')
  })

  it('uses the provider locale for filtering and allows an explicit override', async () => {
    await render(FilterFixture)

    await expect.element(page.getByTestId('context-filter')).toHaveTextContent('true')
    await expect.element(page.getByTestId('overridden-filter')).toHaveTextContent('false')
  })
})
