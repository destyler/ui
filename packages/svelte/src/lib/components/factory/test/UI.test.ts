import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import UIFixture from './UIFixture.svelte'

describe('[factory] UI', () => {
  it('renders regular, void HTML, and SVG elements with live refs', async () => {
    const screen = await render(UIFixture)

    await expect.element(screen.getByTestId('default')).toMatchTextContent('Default content')
    await expect.element(screen.getByTestId('default')).toHaveAttribute('class', 'default-class')
    await expect.element(screen.getByRole('textbox', { name: 'factory input' })).toHaveValue('value')
    await expect.element(screen.getByTestId('circle')).toHaveAttribute('r', '4')
    await expect.element(screen.getByTestId('default-ref')).toMatchTextContent('BUTTON')
    await expect.element(screen.getByTestId('input-ref')).toMatchTextContent('INPUT')
    await expect.element(screen.getByTestId('svg-ref')).toMatchTextContent('http://www.w3.org/2000/svg')
  })

  it('merges asChild attributes and event handlers and releases refs on destroy', async () => {
    const screen = await render(UIFixture)
    const child = screen.getByTestId('as-child')

    await expect.element(child).toHaveAttribute('class', 'parent-class child-class')
    await expect.element(child).toHaveAttribute('data-parent', 'present')
    await expect.element(screen.getByTestId('child-ref')).toMatchTextContent('BUTTON')
    await expect.element(screen.getByTestId('child-attachment-ref')).toMatchTextContent('BUTTON')

    await child.click()
    await expect.element(screen.getByTestId('parent-clicks')).toMatchTextContent('1')
    await expect.element(screen.getByTestId('child-clicks')).toMatchTextContent('1')

    await screen.getByRole('button', { name: 'Unmount factory nodes' }).click()
    await expect.element(screen.getByTestId('default-ref')).toMatchTextContent('none')
    await expect.element(screen.getByTestId('child-ref')).toMatchTextContent('none')
    await expect.element(screen.getByTestId('child-attachment-ref')).toMatchTextContent('none')
    await expect.element(screen.getByTestId('svg-ref')).toMatchTextContent('none')
    await expect.element(screen.getByTestId('input-ref')).toMatchTextContent('none')
  })
})
