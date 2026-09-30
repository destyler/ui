import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { InitialValue } from '../examples/InitialValue'
import { Tree, treeAnatomy } from '../index'

describe('[tree] component', () => {
  it.each(getParts(treeAnatomy))('should render part %s', (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(treeAnatomy))('should export %s', (part) => {
    expect(Tree).toHaveProperty(part, expect.anything())
  })

  it('seeds default* via InitialValue example', async () => {
    render(<InitialValue />)
    const src = document.querySelector('[data-part="branch"][data-value="src"]')
    const modules = document.querySelector('[data-part="branch"][data-value="node_modules"]')
    expect(src).toHaveAttribute('aria-selected', 'true')
    expect(src).toHaveAttribute('aria-expanded', 'true')
    expect(src).toHaveAttribute('data-state', 'open')
    expect(modules).toHaveAttribute('aria-expanded', 'true')
    await expect.element(page.getByText('app.tsx', { exact: true })).toBeVisible()
    await userEvent.click(page.getByText('src', { exact: true }))
    await expect.element(page.getByText('app.tsx', { exact: true })).not.toBeVisible()
    expect(src).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(page.getByText('src', { exact: true }))
    await expect.element(page.getByText('app.tsx', { exact: true })).toBeVisible()
    expect(src).toHaveAttribute('aria-selected', 'true')
    expect(src).toHaveAttribute('aria-expanded', 'true')
  })
})
