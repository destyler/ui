import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import MockComponent from './fixtures/Mock.vue'
import PropagateComponent from './fixtures/Propagate.vue'
import StopComponent from './fixtures/Stop.vue'
import UnderComponent from './fixtures/Under.vue'

describe('factory', () => {
  it('should render only the child', async () => {
    render(UnderComponent)

    await expect.element(page.getByTestId('parent')).not.toBeInTheDocument()
    await expect.element(page.getByTestId('child')).toBeVisible()
  })

  it('should override existing props', async () => {
    render(UnderComponent)
    const child = page.getByTestId('child')
    await expect.element(child).toHaveAttribute('id', 'child')
    await expect.element(child).toHaveAttribute('data-part', 'child')
  })

  it('should merge styles and classes', async () => {
    render(UnderComponent)
    const child = page.getByTestId('child')
    await expect.element(child).toHaveStyle({ background: 'red' })
    await expect.element(child).toHaveClass('child parent')
    await expect.element(page.getByText('Destyler UI')).toBeVisible()
  })

  it('should merge events', async () => {
    const parentClick = vi.fn()
    const childClick = vi.fn()
    render(MockComponent, {
      props: {
        onParent: parentClick,
        onChild: childClick,
      },
    })

    await userEvent.click(page.getByTestId('child'))

    expect(parentClick).toHaveBeenCalled()
    expect(childClick).toHaveBeenCalled()
  })

  it('should propagate asChild', async () => {
    render(PropagateComponent)
    await expect.element(page.getByText('Destyler UI')).toHaveAttribute('data-testid', 'parent')
  })

  it('should stop propagate asChild', async () => {
    render(StopComponent)
    await expect.element(page.getByText('Destyler UI')).not.toHaveAttribute('data-testid', 'parent')
  })
})
