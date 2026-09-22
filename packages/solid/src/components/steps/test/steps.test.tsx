import { render, screen } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { Steps, stepsAnatomy } from '../'
import { expectExport, getExports, getParts } from '../../../setup-test'
import { Basic } from '../examples/Basic'
import { InitialStep } from '../examples/InitialStep'

describe('steps', () => {
  it.each(getParts(stepsAnatomy).filter(part => !part.includes('progress')))('renders part %s', (part) => {
    render(() => <Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(stepsAnatomy))('exports %s', (part) => {
    expectExport(Steps, part)
  })

  it('moves to the next step', async () => {
    render(() => <Basic />)
    expect(screen.getByText('First - Contact Info')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('Second - Date & Time')).toBeVisible()
  })

  it('renders list and items as div elements', () => {
    render(() => <Basic />)

    expect(document.querySelector('[data-part="list"]')?.tagName).toBe('DIV')
    for (const item of document.querySelectorAll('[data-part="item"]')) {
      expect(item.tagName).toBe('DIV')
    }
  })

  it('seeds default* via InitialStep example', async () => {
    render(() => <InitialStep />)
    expect(screen.getByText('Second - Date & Time')).toBeVisible()
  })
})
