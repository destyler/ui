import { render, screen, waitFor } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { createSignal } from 'solid-js'
import { Pagination, paginationAnatomy } from '../'
import { getExports, getParts } from '../../../setup-test'
import { ComponentUnderTest } from './basic'

describe('pagination', () => {
  it.each(getParts(paginationAnatomy))('should render part! %s', async (part) => {
    render(() => <ComponentUnderTest count={100} pageSize={10} />)

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(paginationAnatomy))('should export %s', async (part) => {
    expect(Pagination[part]).toBeDefined()
  })

  it('should update page when item is clicked', async () => {
    render(() => <ComponentUnderTest count={100} pageSize={10} />)
    expect(screen.getByLabelText('page 2')).not.toHaveAttribute('aria-current', 'page')

    await user.click(screen.getByLabelText('page 2'))
    expect(screen.getByLabelText('page 2')).toHaveAttribute('aria-current', 'page')
  })

  it('should update page when next button is clicked', async () => {
    render(() => <ComponentUnderTest count={100} pageSize={10} />)
    expect(screen.getByLabelText('page 1')).toHaveAttribute('aria-current', 'page')

    await user.click(screen.getByText(/next/i))
    expect(screen.getByLabelText('page 2')).toHaveAttribute('aria-current', 'page')
  })

  it('should update page when prev button is clicked', async () => {
    render(() => <ComponentUnderTest count={100} pageSize={10} />)

    await user.click(screen.getByLabelText('page 2'))
    expect(screen.getByLabelText('page 2')).toHaveAttribute('aria-current', 'page')

    await user.click(screen.getByText(/prev/i))
    expect(screen.getByLabelText('page 1')).toHaveAttribute('aria-current', 'page')
  })

  it('adds button-only attributes when type changes from link', async () => {
    const [type, setType] = createSignal<'link' | 'button'>('link')

    render(() => (
      <Pagination.Root count={1} type={type()}>
        <Pagination.PrevTrigger data-testid="previous">Previous</Pagination.PrevTrigger>
        <Pagination.Item type="page" value={1} data-testid="item">1</Pagination.Item>
        <Pagination.NextTrigger data-testid="next">Next</Pagination.NextTrigger>
      </Pagination.Root>
    ))

    const previous = screen.getByTestId('previous')
    const item = screen.getByTestId('item')
    const next = screen.getByTestId('next')
    expect(previous).not.toHaveAttribute('type')
    expect(item).not.toHaveAttribute('type')
    expect(next).not.toHaveAttribute('type')

    setType('button')

    await waitFor(() => expect(previous).toHaveAttribute('type', 'button'))
    expect(previous).toBeDisabled()
    expect(item).toHaveAttribute('type', 'button')
    expect(next).toHaveAttribute('type', 'button')
    expect(next).toBeDisabled()
  })
})
