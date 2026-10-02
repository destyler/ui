import { render } from 'vitest-browser-vue'
import { carouselControlContracts } from '../../../../../../utils/test/carousel-control-contracts'
import ControlledAudit from './ControlledAudit.fixture.vue'

carouselControlContracts(async (onRequest) => {
  const screen = await render(ControlledAudit, { props: { onRequest } })
  return () => screen.unmount()
})
