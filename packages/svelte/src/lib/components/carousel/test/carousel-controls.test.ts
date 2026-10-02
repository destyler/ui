import { render } from 'vitest-browser-svelte'
import { carouselControlContracts } from '../../../../../../../utils/test/carousel-control-contracts'
import ControlledAudit from './ControlledAudit.fixture.svelte'

carouselControlContracts(async (onRequest) => {
  const screen = await render(ControlledAudit, { props: { onRequest } })
  return () => screen.unmount()
})
