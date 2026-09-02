import { render, screen, waitFor } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { Label, labelAnatomy } from '../'
import { getExports, getParts } from '../../../setup-test'
import { Basic } from '../examples/Basic'
import { RootProvider } from '../examples/RootProvider'

describe('label', () => {
  it.each(getParts(labelAnatomy))('should render part %s', (part) => {
    render(() => <Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(labelAnatomy))('should export %s', (part) => {
    expect(Label[part]).toBeDefined()
  })

  it('should render label text', () => {
    render(() => <Basic />)
    expect(screen.getByText('Username')).toBeVisible()
  })

  it('should work with RootProvider', () => {
    render(() => <RootProvider />)
    expect(screen.getByText('Email Address')).toBeVisible()
  })

  it('should expose hover state through Context', async () => {
    render(() => (
      <Label.Root>
        Username
        <Label.Context>{label => <span>{label().isHovered ? 'hovered' : 'idle'}</span>}</Label.Context>
      </Label.Root>
    ))

    expect(screen.getByText('idle')).toBeVisible()
    await user.hover(screen.getByText('Username'))
    await waitFor(() => expect(screen.getByText('hovered')).toBeVisible())
  })
})
