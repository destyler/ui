import { render } from 'vitest-browser-svelte'
import { browserSmoke } from '../../../../utils/test/browser-smoke/suite'
import CheckboxExample from '../lib/components/checkbox/examples/Basic.svelte'
import DialogExample from '../lib/components/dialog/examples/Basic.svelte'
import TreeExample from '../lib/components/tree/examples/Basic.svelte'

browserSmoke({
  checkbox: () => render(CheckboxExample),
  dialog: () => render(DialogExample),
  tree: () => render(TreeExample),
})
