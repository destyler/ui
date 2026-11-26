import { render } from 'vitest-browser-vue'
import { browserSmoke } from '../../../../utils/test/browser-smoke/suite'
import CalendarExample from '../components/calendar/examples/Standalone.vue'
import CheckboxExample from '../components/checkbox/examples/Basic.vue'
import DialogExample from '../components/dialog/examples/Basic.vue'
import TreeExample from '../components/tree/examples/Basic.vue'

browserSmoke({
  calendar: () => render(CalendarExample),
  checkbox: () => render(CheckboxExample),
  dialog: () => render(DialogExample),
  tree: () => render(TreeExample),
})
