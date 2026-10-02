import { render } from 'vitest-browser-solid'
import { browserSmoke } from '../../../../utils/test/browser-smoke/suite'
import { Basic as CheckboxExample } from '../components/checkbox/examples/Basic'
import { ComponentUnderTest as DialogExample } from '../components/dialog/test/basic'
import { Basic as TreeExample } from '../components/tree/examples/Basic'

browserSmoke({
  checkbox: () => render(() => <CheckboxExample />),
  dialog: () => render(() => <DialogExample />),
  tree: () => render(() => <TreeExample />),
})
