import { render, screen } from '@solidjs/testing-library'
import user from '@testing-library/user-event'
import { CheckIcon, ClipboardCopyIcon } from 'lucide-solid'
import { Clipboard, clipboardAnatomy } from '../'
import { getExports, getParts } from '../../../setup-test'

function ComponentUnderTest() {
  return (
    <Clipboard.Root value="https://ui-ui.com">
      <Clipboard.Label>Copy this link</Clipboard.Label>
      <Clipboard.Control>
        <Clipboard.Input />
        <Clipboard.Trigger>
          <Clipboard.Indicator copied={<CheckIcon />}>
            <ClipboardCopyIcon />
          </Clipboard.Indicator>
        </Clipboard.Trigger>
      </Clipboard.Control>
    </Clipboard.Root>
  )
}

describe('clipboard', () => {
  it.each(getParts(clipboardAnatomy))('should render part %s', async (part) => {
    render(() => <ComponentUnderTest />)

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(clipboardAnatomy))('should export %s', async (part) => {
    expect(Clipboard[part]).toBeDefined()
  })

  it('should copy the value into the clipboard', async () => {
    render(() => <ComponentUnderTest />)

    await user.click(screen.getByRole('button', { name: 'Copy to clipboard' }))
    expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith('https://ui-ui.com')
  })
})
