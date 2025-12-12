import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import { Pagination, paginationAnatomy } from '../index'

describe('[pagination] component', () => {
  it.each(getParts(paginationAnatomy))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(paginationAnatomy))('should export %s', async (part) => {
    expect(Pagination[part]).toBeDefined()
  })

  it('should update page when item is clicked', async () => {
    render(Basic)

    const pageTwoLink = page.getByLabelText('page 2')
    await expect.element(pageTwoLink).not.toHaveAttribute('aria-current', 'page')

    await userEvent.click(pageTwoLink)
    await expect.element(page.getByLabelText('page 2')).toHaveAttribute('aria-current', 'page')
  })

  it('should update page when next button is clicked', async () => {
    render(Basic)

    const pageOneLink = page.getByLabelText('page 1', { exact: true })
    await expect.element(pageOneLink).toHaveAttribute('aria-current', 'page')
    const nextPageLink = page.getByText(/next/i)

    await userEvent.click(nextPageLink)
    const pageTwoLink = page.getByLabelText('page 2')
    await expect.element(pageTwoLink).toHaveAttribute('aria-current', 'page')
  })

  it('should update page when prev button is clicked', async () => {
    render(Basic)

    const pageTwoLink = page.getByLabelText('page 2')
    await userEvent.click(pageTwoLink)
    await expect.element(page.getByLabelText('page 2')).toHaveAttribute('aria-current', 'page')

    const prevPageLink = page.getByText(/prev/i)
    await userEvent.click(prevPageLink)
    await expect.element(page.getByLabelText('page 1', { exact: true })).toHaveAttribute('aria-current', 'page')
  })
})
