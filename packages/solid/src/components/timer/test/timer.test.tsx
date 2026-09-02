import { render, screen } from '@solidjs/testing-library'
import { Timer, timerAnatomy } from '../'
import { getExports, getParts } from '../../../setup-test'
import { Basic } from '../examples/Basic'

describe('timer', () => {
  const parts = getParts(timerAnatomy).filter(
    part => !['item-value', 'item-label'].some(skipped => part.includes(skipped)),
  )

  it.each(parts)('renders part %s', (part) => {
    render(() => <Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  const exports = getExports(timerAnatomy).filter(
    part => !['ItemValue', 'ItemLabel'].includes(part),
  ) as Array<keyof typeof Timer>

  it.each(exports)('exports %s', (part) => {
    expect(Timer[part]).toBeDefined()
  })

  it('renders timer controls', () => {
    render(() => <Basic />)
    const playButton = screen.getByRole('button', { name: 'Play' })
    expect(playButton).toBeInTheDocument()
    expect(playButton).not.toHaveAttribute('action')
    expect(screen.getByText('Pause')).toBeInTheDocument()
  })
})
