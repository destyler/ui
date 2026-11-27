import { createPortal } from 'react-dom'
import { render } from 'vitest-browser-react'
import { browserSmoke } from '../../../../utils/test/browser-smoke/suite'
import { Standalone as CalendarExample } from '../components/calendar/examples/Standalone'
import { Basic as CheckboxExample } from '../components/checkbox/examples/Basic'
import { Dialog } from '../components/dialog'
import { Basic as DialogExample } from '../components/dialog/examples/Basic'
import { Basic as TreeExample } from '../components/tree/examples/Basic'
import { CalendarValueFixture } from './CalendarValueFixture'

function CalendarDialogFixture() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Open calendar dialog</Dialog.Trigger>
      {createPortal(
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Title>Calendar dialog</Dialog.Title>
            <Dialog.Description>Choose a date</Dialog.Description>
            <CalendarExample />
          </Dialog.Content>
        </Dialog.Positioner>,
        document.body,
      )}
    </Dialog.Root>
  )
}

browserSmoke({
  calendarValue: mode => render(<CalendarValueFixture mode={mode} />),
  calendarDialog: () => render(<CalendarDialogFixture />),
  calendar: () => render(<CalendarExample />),
  checkbox: () => render(<CheckboxExample />),
  dialog: () => render(<DialogExample />),
  tree: () => render(<TreeExample />),
})
