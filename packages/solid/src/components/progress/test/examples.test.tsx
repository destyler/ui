import { render, screen } from '@solidjs/testing-library'
import { Circular, circular } from '../examples/circular'
import { Linear, linear } from '../examples/linear'

describe('progress examples', () => {
  it('should export and render the circular example', () => {
    expect(circular).toBe(Circular)
    const { container } = render(() => <Circular />)

    expect(screen.getByText('42%')).toBeVisible()
    expect(container.querySelector('[data-part="circle"]')).toBeInTheDocument()
  })

  it('should export and render the linear example', () => {
    expect(linear).toBe(Linear)
    const { container } = render(() => <Linear />)

    expect(screen.getByText('42%')).toBeVisible()
    expect(container.querySelector('[data-part="track"]')).toBeInTheDocument()
  })
})
