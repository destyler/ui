import { render, screen } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { Radio, radioAnatomy } from '../'
import { expectExport, getExports, getParts } from '../../../setup-test'
import { InitialValue } from '../examples/InitialValue'
import { ComponentUnderTest } from './basic'

describe('radio Group', () => {
  it.each(getParts(radioAnatomy))('should render part! %s', async (part) => {
    render(() => <ComponentUnderTest />)

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(radioAnatomy))('should export %s', async (part) => {
    expectExport(Radio, part)
  })

  it('should invoke onValueChange if another value has selected', async () => {
    const onValueChange = vi.fn()

    render(() => <ComponentUnderTest onValueChange={onValueChange} />)

    await user.click(screen.getByLabelText('Solid'))
    expect(onValueChange).toHaveBeenCalledWith({ value: 'solid' })
  })

  it('should not invoke onValueChange if option is disabled', async () => {
    const onValueChange = vi.fn()

    render(() => <ComponentUnderTest onValueChange={onValueChange} />)

    await user.click(screen.getByLabelText('Svelte'))
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('seeds default* via InitialValue example', async () => {
    render(() => <InitialValue />)
    const items = document.querySelectorAll('[data-scope="radio-group"][data-part="item"]')
    const solidItem = Array.from(items).find(item => item.textContent?.includes('Solid')) as HTMLElement
    expect(solidItem).toHaveAttribute('data-state', 'checked')
  })
})
