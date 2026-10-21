import { it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { checkControlledMenu } from '../../../utils/test/menu-controlled'
import Controlled from '../src/lib/components/menu/examples/Controlled.svelte'

it('keeps external controlled toggles closed after pointer and focus interactions', async () => {
  await render(Controlled)
  await checkControlledMenu()
})
