import { render, screen } from '@solidjs/testing-library'
import { Close } from '../examples/Close'

describe('avatar examples', () => {
  it('should derive initials and forward image details', () => {
    render(() => <Close name="Grace Hopper" src="avatar.png" />)

    expect(screen.getByText('GH')).toBeInTheDocument()
    const image = document.querySelector('img')
    expect(image).toHaveAttribute('alt', 'Grace Hopper')
    expect(image).toHaveAttribute('src', 'avatar.png')
  })
})
