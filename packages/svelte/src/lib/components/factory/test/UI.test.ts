import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import UIFixture from './UIFixture.svelte'

describe('[factory] UI', () => {
  it('renders regular, void HTML, and SVG elements with live refs', async () => {
    const screen = await render(UIFixture)

    await expect.element(screen.getByTestId('default')).toHaveTextContent('Default content')
    await expect.element(screen.getByTestId('default')).toHaveAttribute('class', 'default-class')
    await expect.element(screen.getByRole('textbox', { name: 'factory input' })).toHaveValue('value')
    await expect.element(screen.getByTestId('circle')).toHaveAttribute('r', '4')
    await expect.element(screen.getByTestId('default-ref')).toHaveTextContent('BUTTON')
    await expect.element(screen.getByTestId('input-ref')).toHaveTextContent('INPUT')
    await expect.element(screen.getByTestId('svg-ref')).toHaveTextContent('http://www.w3.org/2000/svg')
  })

  it('merges asChild attributes and event handlers and releases refs on destroy', async () => {
    const screen = await render(UIFixture)
    const child = screen.getByTestId('as-child')

    await expect.element(child).toHaveAttribute('class', 'parent-class child-class')
    await expect.element(child).toHaveAttribute('data-parent', 'present')
    await expect.element(screen.getByTestId('child-ref')).toHaveTextContent('BUTTON')
    await expect.element(screen.getByTestId('child-attachment-ref')).toHaveTextContent('BUTTON')

    await child.click()
    await expect.element(screen.getByTestId('parent-clicks')).toHaveTextContent('1')
    await expect.element(screen.getByTestId('child-clicks')).toHaveTextContent('1')

    await screen.getByRole('button', { name: 'Unmount factory nodes' }).click()
    await expect.element(screen.getByTestId('default-ref')).toHaveTextContent('none')
    await expect.element(screen.getByTestId('child-ref')).toHaveTextContent('none')
    await expect.element(screen.getByTestId('child-attachment-ref')).toHaveTextContent('none')
    await expect.element(screen.getByTestId('svg-ref')).toHaveTextContent('none')
    await expect.element(screen.getByTestId('input-ref')).toHaveTextContent('none')
  })
})
