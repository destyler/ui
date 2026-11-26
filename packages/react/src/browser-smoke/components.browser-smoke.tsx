import { render } from 'vitest-browser-react'
import { browserSmoke } from '../../../../utils/test/browser-smoke/suite'
import { Standalone as CalendarExample } from '../components/calendar/examples/Standalone'
import { Basic as CheckboxExample } from '../components/checkbox/examples/Basic'
import { Basic as DialogExample } from '../components/dialog/examples/Basic'
import { Basic as TreeExample } from '../components/tree/examples/Basic'

browserSmoke({
  calendar: () => render(<CalendarExample />),
  checkbox: () => render(<CheckboxExample />),
  dialog: () => render(<DialogExample />),
  tree: () => render(<TreeExample />),
})
