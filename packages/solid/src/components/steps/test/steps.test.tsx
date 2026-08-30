import { render, screen } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { Steps, stepsAnatomy } from '../'
import { getExports, getParts } from '../../../setup-test'
import { Basic } from '../examples/Basic'

describe('steps', () => {
  it.each(getParts(stepsAnatomy).filter(part => !part.includes('progress')))('renders part %s', (part) => {
    render(() => <Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(stepsAnatomy))('exports %s', (part) => {
    expect(Steps[part]).toBeDefined()
  })

  it('moves to the next step', async () => {
    render(() => <Basic />)
    expect(screen.getByText('First - Contact Info')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('Second - Date & Time')).toBeVisible()
  })
})
