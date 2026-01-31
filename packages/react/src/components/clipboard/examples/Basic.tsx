import { Clipboard } from '../index'

export function Basic() {
  return (
    <Clipboard.Root value="https://destyler.org">
      <Clipboard.Label>Copy this link</Clipboard.Label>
      <Clipboard.Control>
        <Clipboard.Input />
        <Clipboard.Trigger>
          <Clipboard.Indicator copied={
            <span>Copied!</span>
          }
          >
            <span>Copy</span>
          </Clipboard.Indicator>
        </Clipboard.Trigger>
      </Clipboard.Control>
    </Clipboard.Root>
  )
}
